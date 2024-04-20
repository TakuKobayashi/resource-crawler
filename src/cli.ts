import { program } from 'commander';
import packageJson from '../package.json';
import _ from 'lodash';

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version');

program
  .command('crawl')
  .description('')
  .option('-o, --output <path>', `出力先rootディレクトリpath`)
  .action(async (options: any) => {
  });

program.parse(process.argv);
