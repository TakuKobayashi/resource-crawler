import { program, Command } from 'commander';
import puppeteer from 'puppeteer';
import packageJson from '../package.json';
import { allSearchAndImportFlickrPhotoData } from './libs/services/frickr/api/search';
//import { searchInstagramImagesFromUserName } from './libs/services/instagram/puppeteer/search';
import { searchInstagramImagesFromUserName } from './libs/services/instagram/html/search';
import { exportToInsertSQL } from './libs/utils/data-exporters';

import { config } from 'dotenv';
config();
import { ServiceTypes } from './sequelize/enums/service-types';
import { WordTypes } from './sequelize/enums/word-types';
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
    const keywords: any[] = [];
    if (options.keyword) {
      const [keyword, isCreated] = await models.Keyword.findOrCreate({
        where: {
          service_type: ServiceTypes.flickr,
          word_type: WordTypes.searchword,
          word: options.keyword,
        },
      });
      keywords.push(keyword);
    } else {
      const searchKeywordQueryObj: { [key: string]: any } = {
        service_type: ServiceTypes.flickr,
        word_type: WordTypes.searchword,
      };
      const scraperModel = await models.Scraper.findOne({
        where: {
          service_type: ServiceTypes.flickr,
          word_type: WordTypes.searchword,
        },
      });
      if (scraperModel) {
        searchKeywordQueryObj.id = {
          [models.Sequelize.Op.gt]: scraperModel.last_keyword_id,
        };
      }

      const keywordModels = await models.Keyword.findAll({
        where: searchKeywordQueryObj,
        order: [['id', 'ASC']],
        limit: 10,
      });
      for (const keyword of keywordModels) {
        keywords.push(keyword);
      }
    }
    await allSearchAndImportFlickrPhotoData(keywords);
    if (!options.keyword) {
      const scrapedKeyword = keywords[keywords.length - 1];
      if (scrapedKeyword) {
        const [scrapeModel, isCreated] = await models.Scraper.findOrCreate({
          where: {
            service_type: scrapedKeyword.service_type,
            word_type: WordTypes.searchword,
          },
          defaults: {
            last_keyword_id: scrapedKeyword.id,
            executed_at: new Date(),
          },
        });
        if (!isCreated) {
          scrapeModel.last_keyword_id = scrapedKeyword.id;
          scrapeModel.executed_at = new Date();
          await scrapeModel.save();
        }
      }
    }
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
