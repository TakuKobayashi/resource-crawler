const cheerio = require('cheerio');
const axios = require('axios');

exports.scrapeResourceFromUrl = async function scrapeResourceFromUrl(url) {
  const niconicoPageResponse = await axios.get(url);
  const niconicoPageHeaders = niconicoPageResponse.headers['set-cookie'] || [];
  const shouldAttachCookieHeaderValue = niconicoPageHeaders.find((cookie) => cookie.includes('nicohistory='));
  const $ = cheerio.load(niconicoPageResponse.data);
  const results = [];

  for (const element of Object.values($('#js-initial-watch-data'))) {
    const apiData = $(element).data('api-data');
    if (!apiData) continue;
    const videoMeta = apiData.video;

    results.push({
      id: videoMeta.id.toString(),
      title: videoMeta.title,
      description: videoMeta.description,
      duration_millis: videoMeta.duration,
      thumbnail_image_url: videoMeta.largeThumbnailURL || videoMeta.thumbnailURL,
      posted_date_time: videoMeta.postedDateTime,
      should_attach_cookie_value: shouldAttachCookieHeaderValue,
      videos: [
        {
          url: videoMeta.smileInfo.url,
        },
      ],
    });
  }
  return results;
};
