const requireRoot = require('app-root-path').require;
const twitterStatus = requireRoot('/libs/twitterStatus');
const apiRenderTemplate = requireRoot('/libs/apiRenderTemplate');

exports.handler = async (event, context) => {
  const startTime = new Date();
  console.log(event);
  if (!event.q && !event.user_id && !event.screen_name) {
    return apiRenderTemplate('failed', startTime, twitterStatus.convertStatusesToResourcesObject([]));
  }
  let allSearchResults = [];
  if (event.user_id || event.screen_name) {
    allSearchResults = await twitterStatus.getAllTimelineResourceTweets(event);
  } else {
    allSearchResults = await twitterStatus.searchAllResourceTweets(event);
  }

  return apiRenderTemplate('success', startTime, twitterStatus.convertStatusesToResourcesObject(allSearchResults));
};
