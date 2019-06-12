const requireRoot = require('app-root-path').require;
const niconicoResource = requireRoot("/libs/niconicoResource");
const apiRenderTemplate = requireRoot("/libs/apiRenderTemplate");

exports.handler = async (event, context) => {
  const startTime = new Date();
  console.log(event);
  if (!event.urls) {
    return apiRenderTemplate("failed", startTime, {videos: []});
  }
  const requestUrls = event.urls.split(",");
  const allScrapeResults = [];
  for (const requestUrl of requestUrls){
    const scrapeResults = await niconicoResource.scrapeResourceFromUrl(requestUrl);
    for (const scrapeResult of scrapeResults){
      allScrapeResults.push(scrapeResult);
    }
  }

  return apiRenderTemplate("success", startTime, {
      videos: allScrapeResults
  });
};