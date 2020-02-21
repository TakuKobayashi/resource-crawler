const requireRoot = require('app-root-path').require;
const youtubeResource = requireRoot('/libs/youtubeResource');
const apiRenderTemplate = requireRoot('/libs/apiRenderTemplate');

exports.handler = async (event, context) => {
  const startTime = new Date();
  console.log(event);
  if (!event.urls) {
    return apiRenderTemplate('failed', startTime, youtubeResource.getInfoFromUrl([]));
  }
  const urls = event.urls.split(",")
  const youtubeVideoInfos = await youtubeResource.getInfoFromUrl(urls);
  return apiRenderTemplate('success', startTime, youtubeVideoInfos);
};
