const cheerio = require('cheerio');
const axios = require('axios');
const url = require('url');

const requireRoot = require('app-root-path').require;
const apiRenderTemplate = requireRoot('/libs/apiRenderTemplate');
const googleReverseImageSearch = requireRoot('/libs/googleReverseImageSearch');

exports.handler = async (event, context) => {
  const startTime = new Date();
  console.log(event);
  if (!event.image_url) {
    return apiRenderTemplate('failed', startTime, {
      reverse_images: {},
      websites: [],
    });
  }
  const searchResult = await googleReverseImageSearch.searchReverseImages(event);

  return apiRenderTemplate('success', startTime, searchResult);
};
