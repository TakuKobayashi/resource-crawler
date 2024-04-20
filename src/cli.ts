import { program, Command } from 'commander';
import packageJson from '../package.json';
import { searchFlickrPhotosToFlickerImageResources } from './libs/frickr-search';
import { config } from 'dotenv';
config();

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version');

const downloadCommand = new Command('download');
downloadCommand.description('downlooad');

downloadCommand
  .command('flickr')
  .description('')
  .option('-k, --keyword <keyword>', `検索するキーワード`)
  .action(async (options: any) => {
    const flickrPhotos = await searchFlickrPhotosToFlickerImageResources({ text: options.keyword });
    console.log(flickrPhotos);
  });

program.addCommand(downloadCommand);

program.parse(process.argv);
