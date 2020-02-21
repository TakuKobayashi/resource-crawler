import { parse } from 'url';
import { load } from 'cheerio';
import axios, { AxiosResponse } from 'axios';
import { CandidateWebsite, ResourceResult, ReverseImageObject, WebsiteResource } from './interfaces/resourceResult';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36';
const GOOGLE_REVERSE_SEARCH_ROOT_URL = 'https://www.google.co.jp/searchbyimage';

export async function searchReverseImages(searchParams: { [s: string]: any }): Promise<ResourceResult> {
  // 初期化
  const reverseImageObject: ReverseImageObject = {
    response_url: '',
    suggest_word: '',
    image_query_tag: '',
    candidates: [],
    relative_image_search_query: '',
  };
  const response = await requestReverseImage(searchParams);
  reverseImageObject.response_url = response.request.res.responseUrl;
  const $ = load(response.data);
  for (const searchElement of Object.values($('form').find('input'))) {
    const ele = $(searchElement);
    // 今検索しているキーワード
    if (ele.attr('name') === 'q') {
      reverseImageObject.suggest_word = ele.attr('value');
      // 指定した画像につけられた検索キー
    } else if (ele.attr('name') === 'tbs') {
      reverseImageObject.image_query_tag = ele.attr('value');
    }
  }

  const candidates: CandidateWebsite[] = [];
  for (const candidateElement of Object.values($('.r5a77d').find('a'))) {
    const ele = $(candidateElement);
    if (!ele.attr('href')) continue;
    candidates.push({
      url: ele.attr('href'),
      keyword: ele.text(),
    });
  }
  reverseImageObject.candidates = candidates;

  for (const relationElement of Object.values($('#imagebox_bigimages'))) {
    const ele = $(relationElement);
    const relationImageSearchPath = ele
      .find('h3')
      .find('a')
      .attr('href');
    if (relationImageSearchPath) {
      // ここで出てきたQueryをそのまま画像検索のAPIに投げてくれれば、それはそれでやる形にする
      reverseImageObject.relative_image_search_query = parse(relationImageSearchPath).query;
      break;
    }
  }

  const websites = scrapeGoogleWebsites(response.data);
  return {
    reverse_images: reverseImageObject,
    websites: websites,
  };
}

function scrapeGoogleWebsites(html: string): WebsiteResource[] {
  const $ = load(html);
  const websites: WebsiteResource[] = [];
  for (const element of Object.values($('#search').find('a'))) {
    const ele = $(element);
    const linkAttributes = ele.attr();
    if (!linkAttributes || !linkAttributes.ping) continue;
    const h3Ele = ele.find('h3');
    // 存在しないものは検索結果ではない
    if (!h3Ele.attr()) continue;
    // 入れ子になっているものは検索結果の情報ではない
    if (h3Ele.children().length > 0) continue;
    websites.push({
      url: linkAttributes.href,
      title: h3Ele.text(),
    });
  }
  return websites;
}

async function requestReverseImage(searchParams: { [s: string]: any }): Promise<AxiosResponse> {
  return axios.get(GOOGLE_REVERSE_SEARCH_ROOT_URL, {
    params: searchParams,
    headers: {
      'user-agent': USER_AGENT,
    },
  });
}
