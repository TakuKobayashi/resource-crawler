import { program, Command } from 'commander';
import puppeteer from 'puppeteer';
import packageJson from '../package.json';
import { searchFlickrPhotos, convertToPhotoToObject } from './libs/services/frickr/api/search';
//import { searchInstagramImagesFromUserName } from './libs/services/instagram/puppeteer/search';
import { searchInstagramImagesFromUserName } from './libs/services/instagram/html/search';
import models from './sequelize/models';
import { config } from 'dotenv';
config();
import { v4 as uuidv4 } from 'uuid';
import { ServiceTypes } from './sequelize/enums/service-types';
import { WordTypes } from './sequelize/enums/word-types';
import { ResourceTypes } from './sequelize/enums/resource-types';
type ServiceTypeNames = typeof ServiceTypes;
type WordTypeNames = typeof WordTypes;
/**
 * Set global CLI configurations
 */
program.storeOptionsAsProperties(false);

program.version(packageJson.version, '-v, --version');

const crawlCommand = new Command('crawl');
crawlCommand.description('crawl');

interface ExecuteResultModels {
  [id: string]: {
    resource: any;
    content: any;
  };
}

const searchKeywordRoutine = async ({
  serviceType,
  wordType,
  word,
  execution,
}: {
  serviceType: ServiceTypeNames;
  wordType: WordTypeNames;
  word: string;
  execution: (keyword) => Promise<ExecuteResultModels>;
}) => {
  const [keyword, isCreated] = await models.Keyword.findOrCreate({
    where: {
      service_type: ServiceTypes[serviceType],
      word_type: WordTypes[wordType],
      word: word,
    },
  });
  const idContentResources = await execution(keyword);
  const contentResources = Object.values(idContentResources);
  await models.Content.bulkCreate(
    contentResources.map((contentResource) => contentResource.content),
    { updateOnDuplicate: ['website_url'] },
  );
  await models.Resource.bulkCreate(
    contentResources.map((contentResource) => contentResource.resource),
    { updateOnDuplicate: ['url'] },
  );
  const resourceContentsData: { content_id: number; resource_id: number }[] = [];
  const createdContents = await models.Content.findAll({
    where: { website_url: contentResources.map((contentResource) => contentResource.content.website_url) },
  });
  const createdResources = await models.Resource.findAll({
    where: { url: contentResources.map((contentResource) => contentResource.resource.url) },
  });
  for (const createdContent of createdContents) {
    const contentResource = idContentResources[createdContent.service_content_id];
    const resourceModel = createdResources.find((createdResource) => contentResource.resource.url === createdResource.url);
    if (resourceModel) {
      resourceContentsData.push({
        content_id: createdContent.id,
        resource_id: resourceModel.id,
      });
    }
  }
  await models.ResourceContent.bulkCreate(resourceContentsData);
};

crawlCommand
  .command('flickr')
  .description('')
  .option('-k, --keyword <keyword>', `検索するキーワード`)
  .action(async (options: any) => {
    searchKeywordRoutine({
      serviceType: 'flickr',
      wordType: 'searchword',
      word: options.keyword,
      execution: async (keyword) => {
        const flickrPhotos = await searchFlickrPhotos({ text: keyword.word });
        const flickrImageResources = flickrPhotos.photo.map((flickrPhoto) => convertToPhotoToObject(flickrPhoto));
        const results: ExecuteResultModels = {};
        for (const flickrImageResource of flickrImageResources) {
          results[flickrImageResource.id] = {
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
          };
        }
        return results;
      },
    });
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
