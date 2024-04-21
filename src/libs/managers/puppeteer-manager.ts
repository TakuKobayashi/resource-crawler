import puppeteer, { Browser, Page } from 'puppeteer';

export class PuppeteerManager {
  private static instance?: PuppeteerManager | undefined = undefined;

  private _browser: Browser | undefined = undefined;

  static getInstance() {
    if (!this.instance) {
      this.instance = new PuppeteerManager();
    }
    return this.instance;
  }

  private constructor() {}

  public async init() {
    await this.loadBrowser();
  }

  private async loadBrowser(): Promise<Browser> {
    if (this._browser) {
      return this._browser;
    }
    this._browser = await puppeteer.launch();
    return this._browser;
  }

  public async newPage(): Promise<Page> {
    const browser = await this.loadBrowser();
    return browser.newPage();
  }

  public async close() {
    await this._browser?.close();
  }
}
