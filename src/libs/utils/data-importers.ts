import models from '../../sequelize/models';
import { WordTypes } from '../../sequelize/enums/word-types';
import _ from 'lodash';

export interface ScrapedDataModels {
  [resourceUrl: string]: {
    resource: any;
    content: any;
    contentTags: string[];
  };
}

export async function importScrapedData({ keywordModel, scrapedDataModels }: { keywordModel: any; scrapedDataModels: ScrapedDataModels }) {
  const contentResources = Object.values(scrapedDataModels);
  const importContentModels = _.uniqBy(
    _.compact(contentResources.map((contentResource) => contentResource.content)),
    (content) => content.website_url,
  );
  const importResourceModels = _.uniqBy(
    _.compact(contentResources.map((contentResource) => contentResource.resource)),
    (resource) => resource.url,
  );
  await models.Content.bulkCreate(importContentModels, { updateOnDuplicate: ['website_url'] });
  await models.Resource.bulkCreate(importResourceModels, { updateOnDuplicate: ['url'] });
  const createdContents = await models.Content.findAll({
    where: { website_url: importContentModels.map((contentModel) => contentModel.website_url) },
  });
  const createdResources = await models.Resource.findAll({
    where: { url: importResourceModels.map((resourceModel) => resourceModel.url) },
  });
  const resourceContentsData: { content_id: number; resource_id: number }[] = [];
  const contentTagsData: { content_id: number; tag: string }[] = [];
  const resourceKeywordsData: { keyword_id: number; resource_id: number }[] = [];
  const newKeywordsData: { service_type: number; word_type: number; word: string }[] = [];
  for (const createdResource of createdResources) {
    const contentResource = scrapedDataModels[createdResource.url];
    const contentModel = createdContents.find((createdContent) => contentResource.content.website_url === createdContent.website_url);
    if (contentModel) {
      resourceContentsData.push({
        content_id: contentModel.id,
        resource_id: createdResource.id,
      });
      for (const tag of contentResource.contentTags) {
        contentTagsData.push({
          content_id: contentModel.id,
          tag: tag,
        });
        newKeywordsData.push({
          service_type: keywordModel.service_type,
          word_type: WordTypes.searchword,
          word: tag,
        });
      }
    }
    resourceKeywordsData.push({
      resource_id: createdResource.id,
      keyword_id: keywordModel.id,
    });
  }
  await Promise.all([
    models.ResourceContent.bulkCreate(resourceContentsData, { updateOnDuplicate: ['content_id'] }),
    models.ResourceKeyword.bulkCreate(resourceKeywordsData, { updateOnDuplicate: ['resource_id'] }),
    models.ContentTag.bulkCreate(contentTagsData, { updateOnDuplicate: ['content_id'] }),
    models.Keyword.bulkCreate(
      _.uniqBy(newKeywordsData, (keyword) => keyword.word),
      { updateOnDuplicate: ['word'] },
    ),
  ]);
  // ずれたauto_incrementの値を元に戻す
  await Promise.all([
    models.sequelize.query(`ALTER TABLE \`${models.Content.tableName}\` auto_increment = 1;`),
    models.sequelize.query(`ALTER TABLE \`${models.Resource.tableName}\` auto_increment = 1;`),
    models.sequelize.query(`ALTER TABLE \`${models.ResourceContent.tableName}\` auto_increment = 1;`),
    models.sequelize.query(`ALTER TABLE \`${models.ResourceKeyword.tableName}\` auto_increment = 1;`),
    models.sequelize.query(`ALTER TABLE \`${models.ContentTag.tableName}\` auto_increment = 1;`),
    models.sequelize.query(`ALTER TABLE \`${models.Keyword.tableName}\` auto_increment = 1;`),
  ]);
}
