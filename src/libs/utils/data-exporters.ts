import models from '../../sequelize/models';
import databaseConfig from '../../sequelize/config/config';
import path from 'path';
import _ from 'lodash';
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
  for (const tableName of tableNames) {
    const exportFullDumpSql = path.join(__dirname, `${tableName}.sql`);
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
  }
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
