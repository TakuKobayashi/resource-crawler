import models from '../../sequelize/models';
import databaseConfig from '../../sequelize/config/config';
import path from 'path';
import _ from 'lodash';
import fs from 'fs';
import readline from 'readline';

const util = require('node:util');
const child_process = require('node:child_process');

interface ShowTablesResult {
  Tables_in_resource_crawler: string;
}

const excludeExportTableNames = ['SequelizeMeta'];

export async function exportToInsertSQL() {
  const tableNames = await loadExistTableNames();
  const mysqldumpCommandParts = ['mysqldump', '-u', databaseConfig.username, '-h', databaseConfig.host];
  if (databaseConfig.password) {
    mysqldumpCommandParts.push(`-p${databaseConfig.password}`);
  }
  const appDir = path.dirname(require.main?.filename || '');
  for (const tableName of tableNames) {
    // cli.ts がある場所なのでSQLを保管する場所を指定する
    if (!fs.existsSync(path.join(appDir, `..`, 'sqls', `tables`))) {
      fs.mkdirSync(path.join(appDir, `..`, 'sqls', `tables`), { recursive: true });
    }
    const exportFullDumpSql = path.join(appDir, `..`, 'sqls', `tables`, `${tableName}.sql`);
    const mysqldumpCommands = [
      ...mysqldumpCommandParts,
      databaseConfig.database,
      tableName,
      '--no-create-info',
      '-c',
      '--order-by-primary',
      '--skip-extended-insert',
      '--skip-add-locks',
      '--skip-comments',
      '--compact',
      '>',
      exportFullDumpSql,
    ];
    const childProcessExec = util.promisify(child_process.exec);
    await childProcessExec(mysqldumpCommands.join(' '));
    await splitFileFromLines(exportFullDumpSql, tableName, 10000);
  }
}

async function splitFileFromLines(filepath: string, tableName: string, numberToDividedLines: number) {
  const documentSrc = fs.createReadStream(filepath);
  const fileLines = await execFileLineCount(filepath);
  let dividedFiles: number = 0;
  if (fileLines % numberToDividedLines === 0) {
    dividedFiles = fileLines / numberToDividedLines;
  } else {
    dividedFiles = fileLines / numberToDividedLines + 1;
  }
  const appDir = path.dirname(require.main?.filename || '');
  if (!fs.existsSync(path.join(appDir, `..`, 'sqls', `tables`, tableName))) {
    fs.mkdirSync(path.join(appDir, `..`, 'sqls', `tables`, tableName), { recursive: true });
  }
  for (let i = 1; i <= dividedFiles; i += 1) {
    const dividedFile = fs.createWriteStream(path.join(appDir, `..`, 'sqls', `tables`, tableName, `${tableName}_${i}.sql`));
    const startLine = (i - 1) * numberToDividedLines + 1;
    let readCounter = 1;
    const reader = readline.createInterface({ input: documentSrc });
    // 書き出しポイントから分割する行数×周回までファイルに出力
    reader.on('line', (data) => {
      if (startLine <= readCounter && readCounter < i * numberToDividedLines) {
        dividedFile.write(`${data.trim()}\n`);
      } else if (startLine <= readCounter && readCounter === i * numberToDividedLines) {
        dividedFile.write(`${data.trim()}`);
      }
      readCounter += 1;
    });
    dividedFile.on('error', (err) => {
      if (err) console.log(err.message);
    });
  }
}

async function execFileLineCount(targetFile: string) {
  const childProcessExec = util.promisify(child_process.exec);
  const { stdout } = await childProcessExec.exec(`cat ${targetFile} | wc -l`);
  return parseInt(stdout, 10);
}

export async function loadExistTableNames(): Promise<string[]> {
  const allTables = await models.sequelize.query(`SHOW TABLES`);
  const existTables: ShowTablesResult[] = _.uniq(allTables.flat());
  const tables: string[] = [];
  for (const existTable of existTables) {
    if (excludeExportTableNames.includes(existTable['Tables_in_resource_crawler'])) {
      continue;
    }
    tables.push(existTable['Tables_in_resource_crawler']);
  }
  return tables;
}
