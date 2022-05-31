import serverlessExpress from '@vendia/serverless-express';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { getHashes, createHash } from 'crypto';

import { flickrSearchRouter } from './routes/flickr/search';
import { googleSearchRouter } from './routes/google/search';
import { googleMapRouter } from './routes/google/map';
import { instagramSearchRouter } from './routes/instagram/search';
import { niconicoImageRouter } from './routes/niconico/image';
import { niconicoVideoRouter } from './routes/niconico/video';
import { niconicoThreedmodelRouter } from './routes/niconico/threedmodel';
import { soundcloudSearchRouter } from './routes/soundcloud/search';
import { tumblrSearchRouter } from './routes/tumblr/search';
import { twitterSearchRouter } from './routes/twitter/search';
import { websiteScrapeRouter } from './routes/website/scrape';
import { youtubeVideoRouter } from './routes/youtube/video';

const app = express();

app.use(bodyParser.text({ type: '*/*' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/flickr/search', flickrSearchRouter);
app.use('/google/search', googleSearchRouter);
app.use('/google/map', googleMapRouter);
app.use('/instagram/search', instagramSearchRouter);
app.use('/niconico/image', niconicoImageRouter);
app.use('/niconico/video', niconicoVideoRouter);
app.use('/niconico/threedmodel', niconicoThreedmodelRouter);
app.use('/soundcloud/search', soundcloudSearchRouter);
app.use('/tumblr/search', tumblrSearchRouter);
app.use('/twitter/search', twitterSearchRouter);
app.use('/website/scrape', websiteScrapeRouter);
app.use('/youtube/video', youtubeVideoRouter);

app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    message: 'Hello from root!',
  });
});

app.get('/crypttest', (req: Request, res: Response, next: NextFunction) => {
  const queriesJson = JSON.stringify(req.query);
  // 以降は https://qiita.com/koki_develop/items/174aefd8f894fea4d11a を参照
  // `crypto.createHash('アルゴリズム名').update('文字列').digest('hex')`
  res.json({
    // サポートされているハッシュアルゴリズムを確認
    // getHashes: getHashes(),
    md5: createHash('md5').update(queriesJson).digest('hex'),
    rmd160: createHash('rmd160').update(queriesJson).digest('hex'),
    sha1: createHash('sha1').update(queriesJson).digest('hex'),
    sha256: createHash('sha256').update(queriesJson).digest('hex'),
    sha384: createHash('sha384').update(queriesJson).digest('hex'),
    sha512: createHash('sha512').update(queriesJson).digest('hex'),
  });
});

export const handler = serverlessExpress({ app });
