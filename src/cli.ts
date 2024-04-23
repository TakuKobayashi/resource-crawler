import { program, Command } from 'commander';
import puppeteer from 'puppeteer';
import packageJson from '../package.json';
import { searchFlickrPhotos, convertToPhotoToObject } from './libs/services/frickr/api/search';
//import { searchInstagramImagesFromUserName } from './libs/services/instagram/puppeteer/search';
import { searchInstagramImagesFromUserName } from './libs/services/instagram/html/search';
import models from './sequelize/models';
import { config } from 'dotenv';
config();
import { ServiceTypes } from './sequelize/enums/service-types';
import { WordTypes } from './sequelize/enums/word-types';

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version');

const crawlCommand = new Command('crawl');
crawlCommand.description('crawl');

crawlCommand
  .command('flickr')
  .description('')
  .option('-k, --keyword <keyword>', `検索するキーワード`)
  .action(async (options: any) => {
    const keyword = await models.Keyword.findOrCreate({
      where: {
        service_type: ServiceTypes.flickr,
        word_type: WordTypes.searchword,
        word: options.keyword,
      },
    });
    console.log(keyword);
    const flickrPhotos = await searchFlickrPhotos({ text: keyword.word });
    const flickrImageResources = flickrPhotos.photo.map((flickrPhoto) => convertToPhotoToObject(flickrPhoto));
    console.log(flickrPhotos);
    console.log(flickrImageResources);
  });

crawlCommand
  .command('instagram')
  .description('')
  .option('-u, --username <username>', `検索するユーザー名`)
  .action(async (options: any) => {
    await searchInstagramImagesFromUserName({ userName: options.username });
  });

program.addCommand(crawlCommand);

program
  .command('pupperteer')
  .description('')
  .option('-u, --url <url>', `スクレイピングするURL`)
  .action(async (options: any) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
      console.log({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData(),
      });
      await request.continue();
    });
    page.on('response', async (response) => {
      console.log({
        method: response.request().method,
        url: response.url(),
        headers: response.headers(),
        status: response.status(),
      });
    });
    await page.goto('https://www.instagram.com/user_name/', { waitUntil: 'networkidle0' });
    //const html = await page.content();
    //console.log(html);
    await browser.close();
  });

program.parse(process.argv);
