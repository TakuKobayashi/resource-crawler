'use strict';
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const util = require('node:util');
const child_process = require('node:child_process');
const excludeExportTableNames = ['SequelizeMeta'];

async function loadExistTableNames(sequelize) {
  const allTables = await sequelize.query(`SHOW TABLES`);
  const existTables = _.uniq(allTables.flat());
  const tables = [];
  for (const existTable of existTables) {
    if (excludeExportTableNames.includes(existTable['Tables_in_resource_crawler'])) {
      continue;
    }
    tables.push(existTable['Tables_in_resource_crawler']);
  }
  return tables;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;
    const databaseConfig = sequelize.config;
    const targetTableNames = await loadExistTableNames(sequelize);
    const mysqldumpCommandParts = ['mysql', '-u', databaseConfig.username, '-h', databaseConfig.host];
    if (databaseConfig.password) {
      mysqldumpCommandParts.push(`-p${databaseConfig.password}`);
    }
    // -f エラーがあっても無視して取り込む
    mysqldumpCommandParts.push('-f');
    // 取り込むときに文字コードを指定する
    mysqldumpCommandParts.push(`--default-character-set=${sequelize.options.define.charset}`);
    mysqldumpCommandParts.push(databaseConfig.database);
    const childProcessExec = util.promisify(child_process.exec);
    const mysqlImportFilePromises = [];
    for (const tableName of targetTableNames) {
      const sqlFilePathes = fg.sync([__dirname, '..', '..', `..`, 'sqls', `tables`, tableName, '**', '*.sql'].join('/'), { dot: true });
      if (sqlFilePathes.length > 0) {
        for (const sqlFilePath of sqlFilePathes) {
          const mysqldumpCommands = mysqldumpCommandParts.concat(['<', sqlFilePath]);
          const mysqldumpCommand = mysqldumpCommands.join(' ');
          mysqlImportFilePromises.push(childProcessExec(mysqldumpCommand));
        }
      }
    }
    await Promise.all(mysqlImportFilePromises);
  },

  async down(queryInterface, Sequelize) {
    const targetTableNames = await loadExistTableNames(queryInterface.sequelize);
    const queryPromises = [];
    for (const tableName of targetTableNames) {
      queryPromises.push(queryInterface.sequelize.query(`TRUNCATE TABLE ${tableName}`));
    }
    await Promise.all(queryPromises);
  },
};
