//const requireRoot = require('app-root-path').require;
//const util = requireRoot('/libs/util');
import { PuppeteerManager } from '../../../managers/puppeteer-manager';

const cheerio = require('cheerio');

const INSTAGRAM_ROOT_URL = 'https://www.instagram.com';

export async function searchInstagramImagesFromUserName({ userName }: { userName: string }) {
  const page = await PuppeteerManager.getInstance().newPage();
  await page.setRequestInterception(true);
  page.on('request', async (request) => {
    const responseUrl = new URL(request.url());
    if (responseUrl.pathname === '/api/graphql') {
      console.log({
        method: request.method(),
        url: request.url(),
        headers: request.headers(),
        postData: request.postData(),
      });
    }
    await request.continue();
  });
  page.on('response', async (response) => {
    const responseUrl = new URL(response.url());
    if (responseUrl.pathname !== '/api/graphql') {
      return;
    }
    const json = await response.json();
    console.log({
      method: response.request().method(),
      url: response.url(),
      headers: response.headers(),
      status: response.status(),
      json: json,
    });
  });
  const gotoUrl = new URL(INSTAGRAM_ROOT_URL);
  gotoUrl.pathname = userName;
  await page.goto(gotoUrl.href, { waitUntil: 'networkidle0' });
  const html = await page.content();
  const $ = cheerio.load(html);
  //console.log(html);
  await PuppeteerManager.getInstance().close();
}
