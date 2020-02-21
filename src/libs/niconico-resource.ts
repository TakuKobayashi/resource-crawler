import { load } from 'cheerio';
import axios from 'axios';
import { NiconicoVideoResource } from './interfaces/resourceResult';

export async function scrapeResourceFromUrl(url: string): Promise<NiconicoVideoResource[]> {
  const niconicoPageResponse = await axios.get(url);
  const niconicoPageHeaders: string[] = niconicoPageResponse.headers['set-cookie'] || [];
  const shouldAttachCookieHeaderValue = niconicoPageHeaders.find((cookie: string) => cookie.includes('nicohistory='));
  const $ = load(niconicoPageResponse.data);
  const results: NiconicoVideoResource[] = [];

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
}
