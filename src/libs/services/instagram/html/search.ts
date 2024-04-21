import axios from 'axios';
import cheerio from 'cheerio';
import { tryParseJSON } from '../../../util';

const INSTAGRAM_ROOT_URL = 'https://www.instagram.com';

export async function searchInstagramImagesFromUserName({ userName }: { userName: string }) {
  const gotoUrl = new URL(INSTAGRAM_ROOT_URL);
  gotoUrl.pathname = userName;
  const response = await axios.get(gotoUrl.href);
  const $ = cheerio.load(response.data);
  $('script').each((i, item) => {
    const json = tryParseJSON($(item).text());
    if (json) {
      const arr = json.require || [];
      console.log(JSON.stringify(arr));
    }
  });
}

export async function loadImagesQuery({
  docId,
  instagramUserId,
  pageCursor,
}: {
  docId: string;
  instagramUserId: string;
  pageCursor: string;
}) {
  const queryUrl = new URL(INSTAGRAM_ROOT_URL);
  queryUrl.pathname = '/graphql/query/';
  const variableObj = { id: instagramUserId, after: pageCursor, first: 50 };
  const params = { doc_id: docId, variables: JSON.stringify(variableObj) };
  const response = await axios.get(queryUrl.href, { params: params });
  return response.data;
}
