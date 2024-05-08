'use strict';
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
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
    const targetTableNames = await loadExistTableNames(queryInterface.sequelize);
    for (const tableName of targetTableNames) {
      const sqlFilePathes = fg.sync([__dirname, '..', '..', `..`, 'sqls', `tables`, tableName, '**', '*.sql'].join('/'), { dot: true });
      if (sqlFilePathes.length > 0) {
        await queryInterface.sequelize.transaction(async (t) => {
          for (const sqlFilePath of sqlFilePathes) {
            const insertSqls = fs.readFileSync(sqlFilePath, 'utf-8');
            for (const insertSqlLine of insertSqls.split('\n')) {
              if (insertSqlLine) {
                await queryInterface.sequelize.query(insertSqlLine);
              }
            }
          }
        });
      }
    }
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
