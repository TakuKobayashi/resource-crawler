import { ResourceResult, TwitterImageResource, TwitterVideoResource, TwitterWebsiteResource } from './interfaces/resourceResult';
import * as Twitter from 'twitter';

const TWITTER_ROOT_URL = 'https://twitter.com/';

function newTwitter(): Twitter {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_BOT_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_BOT_ACCESS_TOKEN_SECRET,
  });
}

export async function getTweets(apiPath: string, searchParams: { [s: string]: any }): Promise<Twitter.ResponseData> {
  const keys = Object.keys(searchParams);
  for (const key of keys) {
    if (!searchParams[key]) {
      delete searchParams[key];
    }
  }
  const result = await newTwitter().get(apiPath, searchParams);
  return result as Twitter.ResponseData;
}

export async function searchTweets(searchParams: { [s: string]: any }): Promise<Twitter.ResponseData> {
  const searchQueries = Object.assign({ count: 100 }, searchParams);
  return getTweets('search/tweets', searchQueries);
}

export async function searchAllTweets(searchParams: { [s: string]: any }) {
  let allSearchResults = [];
  let maxId = null;
  while (true) {
    let err;
    const searchQueries = Object.assign({ max_id: maxId }, searchParams);
    const searchResults = await searchTweets(searchQueries).catch((error) => {
      err = error;
    });
    if (err || !searchResults) {
      break;
    }
    allSearchResults = allSearchResults.concat(searchResults.data.statuses);
    maxId = searchResults.data.search_metadata.max_id;
    if (!searchResults.data.search_metadata.next_results) {
      break;
    }
  }
  return allSearchResults;
}

export async function searchResourceTweets(searchParams) {
  const tweets = await searchTweets(searchParams);
  return filterResourceTweets(tweets.data.statuses);
}

export async function searchAllResourceTweets(searchParams) {
  const tweets = await searchAllTweets(searchParams);
  return filterResourceTweets(tweets);
}

export async function getTimelineTweets(searchParams) {
  const searchQueries = Object.assign({ count: 200 }, searchParams);
  return getTweets('statuses/user_timeline', searchQueries);
}

export async function getAllTimelineTweets(searchParams) {
  let allSearchResults = [];
  let maxId = null;
  while (true) {
    let err;
    const searchQueries = Object.assign({ max_id: maxId }, searchParams);
    const searchResults = await getTimelineTweets(searchQueries).catch((error) => {
      err = error;
    });
    if (err || !searchResults) {
      break;
    }
    allSearchResults.push(...searchResults.data);
    if (searchResults.data.length > 0) {
      maxId = searchResults.data[searchResults.data.length - 1].id;
    } else {
      maxId = 0;
    }
    if (err || maxId <= 0) {
      break;
    }
  }
  return allSearchResults;
}

export async function getTimelineResourceTweets(searchParams) {
  const tweets = await getTimelineTweets(searchParams);
  return filterResourceTweets(tweets.data);
}

export async function getAllTimelineResourceTweets(searchParams) {
  const tweets = await getAllTimelineTweets(searchParams);
  return filterResourceTweets(tweets);
}

function filterResourceTweets(tweets) {
  return tweets.filter(function(tweet) {
    if (tweet.entities.urls.length > 0) {
      return true;
    }
    if (tweet.entities.media && tweet.entities.media.length > 0) {
      return true;
    }
    if (tweet.extended_entities && tweet.extended_entities.media.length > 0) {
      return true;
    }
    return false;
  });
}

export function convertStatusesToResourcesObject(statuses): ResourceResult {
  const twitterWebsites: TwitterWebsiteResource[] = [];
  const twitterImages: TwitterImageResource[] = [];
  const twitterVideos: TwitterVideoResource[] = [];
  for (const status of statuses) {
    for (const website_url of status.entities.urls) {
      twitterWebsites.push({
        id: status.id.toString(),
        user_id: status.user.id.toString(),
        user_name: status.user.screen_name,
        tweet: status.text,
        url: website_url,
      });
    }
    if (status.extended_entities) {
      const twitterWebsiteUrl = [TWITTER_ROOT_URL, status.user.screen_name, '/status/' + status.id].join();
      for (const twitterMedia of status.extended_entities.media) {
        if (twitterMedia.video_info) {
          twitterVideos.push({
            id: status.id.toString(),
            user_id: status.user.id.toString(),
            user_name: status.user.screen_name,
            tweet: status.text,
            website_url: twitterWebsiteUrl,
            duration_millis: twitterMedia.video_info.duration_millis,
            thumbnail_image_url: twitterMedia.media_url_https,
            videos: twitterMedia.video_info.variants.map((variant) => {
              return {
                url: variant.url,
                bitrate: variant.bitrate,
              };
            }),
          });
        } else {
          twitterImages.push({
            id: status.id.toString(),
            user_id: status.user.id.toString(),
            user_name: status.user.screen_name,
            tweet: status.text,
            website_url: twitterWebsiteUrl,
            image_url: twitterMedia.media_url_https,
          });
        }
      }
    }
    return {
      websites: twitterWebsites,
      images: twitterImages,
      videos: twitterVideos,
    };
  }
}
