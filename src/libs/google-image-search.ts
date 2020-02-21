//const requireRoot = require('app-root-path').require;
//const util = requireRoot('/libs/util');
import { GoogleImageResource } from './interfaces/resourceResult';
import { sleep, tryParseJSON } from './util';
import { load } from 'cheerio';
import axios, { AxiosResponse } from 'axios';

const GOOGLE_SEARCH_ROOT_URL = 'https://www.google.co.jp/search';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36';
const LIMIT_SEARCH_MILLISECOND = 240000;
const MAX_REQUEST_SLEEP_MILLISECOND = 1000;

export async function searchGoogleToObjects(searchParams: { [s: string]: any }): Promise<GoogleImageResource[]> {
  const response = await searchGoogle(searchParams);
  const $ = load(response.data);
  const results: GoogleImageResource[] = [];

  for (const element of Object.values($('.rg_meta'))) {
    const meta = tryParseJSON($(element).text());
    if (!meta) continue;
    results.push({
      id: meta.id,
      relation_id: meta.rid,
      website_name: meta.st,
      title: meta.pt,
      describe: meta.s,
      website_url: meta.ru,
      image_url: meta.ou,
    } as GoogleImageResource);
  }
  return results;
}

export async function searchAllGoogleImages(searchObj: { [s: string]: any }): Promise<GoogleImageResource[]> {
  let allSearchResults: GoogleImageResource[] = [];
  let counter = 0;
  const startTime = new Date().getTime();
  while (new Date().getTime() - startTime < LIMIT_SEARCH_MILLISECOND) {
    const searchQueries = Object.assign(
      {
        tbm: 'isch',
        start: counter,
        ijn: Math.floor(counter / 100),
      },
      searchObj,
    );
    const requestStartTime = new Date().getTime();
    const searchResults = await searchGoogleToObjects(searchQueries);
    if (searchResults.length <= 0) {
      break;
    }
    counter = counter + searchResults.length;
    allSearchResults.push(...searchResults);
    const elapsedMilliSecond = new Date().getTime() - requestStartTime;
    if (elapsedMilliSecond < MAX_REQUEST_SLEEP_MILLISECOND) {
      await sleep(elapsedMilliSecond);
    }
  }

  return allSearchResults;
}

async function searchGoogle(searchParams: { [s: string]: any }): Promise<AxiosResponse> {
  return axios.get(GOOGLE_SEARCH_ROOT_URL, {
    params: searchParams,
    headers: {
      'user-agent': USER_AGENT,
    },
  });
}
