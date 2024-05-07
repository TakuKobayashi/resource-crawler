import { program, Command } from 'commander';
import puppeteer from 'puppeteer';
import packageJson from '../package.json';
import { searchFlickrPhotos, convertToPhotoToObject } from './libs/services/frickr/api/search';
//import { searchInstagramImagesFromUserName } from './libs/services/instagram/puppeteer/search';
import { searchInstagramImagesFromUserName } from './libs/services/instagram/html/search';
import { importScrapedData, ScrapedDataModels } from './libs/utils/data-importers';
import { exportToInsertSQL } from './libs/utils/data-exporters';

import { config } from 'dotenv';
config();
import { ServiceTypes } from './sequelize/enums/service-types';
import { WordTypes } from './sequelize/enums/word-types';
import { ResourceTypes } from './sequelize/enums/resource-types';
import models from './sequelize/models';

/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version');

const scrapeCommand = new Command('scrape');
scrapeCommand.description('scrape services');

scrapeCommand
  .command('flickr')
  .description('')
  .option('-k, --keyword <keyword>', `検索するキーワード`)
  .action(async (options: any) => {
    const [keyword, isCreated] = await models.Keyword.findOrCreate({
      where: {
        service_type: ServiceTypes.flickr,
        word_type: WordTypes.searchword,
        word: options.keyword,
      },
    });
    let page = 1;
    let totalPageCount = 0;
    do {
      const flickrPhotos = await searchFlickrPhotos({ text: keyword.word, page: page });
      page = flickrPhotos.page;
      totalPageCount = flickrPhotos.pages;
      const flickrImageResources = flickrPhotos.photo.map((flickrPhoto) => convertToPhotoToObject(flickrPhoto));
      const results: ScrapedDataModels = {};
      for (const flickrImageResource of flickrImageResources) {
        results[flickrImageResource.image_url] = {
          content: {
            service_type: keyword.service_type,
            title: flickrImageResource.title,
            website_url: flickrImageResource.website_url,
            service_content_id: flickrImageResource.id,
            service_user_id: flickrImageResource.user_id,
            service_user_name: flickrImageResource.user_name,
            latitude: flickrImageResource.latitude,
            longitude: flickrImageResource.longitude,
          },
          resource: {
            resource_type: ResourceTypes.image,
            url: flickrImageResource.image_url,
          },
          contentTags: flickrImageResource.tags.split(' '),
        };
      }
      await importScrapedData({ keywordModel: keyword, scrapedDataModels: results });
      page += 1;
    } while (page <= totalPageCount);
  });

scrapeCommand
  .command('instagram')
  .description('')
  .option('-u, --username <username>', `検索するユーザー名`)
  .action(async (options: any) => {
    await searchInstagramImagesFromUserName({ userName: options.username });
  });

program.addCommand(scrapeCommand);

const exportCommand = new Command('export');

exportCommand
  .command('sql')
  .description('')
  .action(async (options: any) => {
    await exportToInsertSQL();
  });

program.addCommand(exportCommand);

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
