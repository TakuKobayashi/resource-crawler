import serverlessExpress from '@vendia/serverless-express';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { createHash } from 'crypto';
import path from 'path';
import jimp from 'jimp';
import { DynamoDBORM } from 'node-dynamodb-orm';

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

console.log(process.env);
// OFFLINEならばLOCDALを参照してそうじゃなければAWS上にあるDynamoDBを参照する
if (process.env.IS_OFFLINE) {
  DynamoDBORM.updateConfig({ region: process.env.AWS_REGION, endpoint: 'http://localhost:8000' });
} else {
  DynamoDBORM.updateConfig({
    region: process.env.AWS_REGION,
  });
}

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

app.get('/dbtest', async (req: Request, res: Response, next: NextFunction) => {
  const resourcedb = new DynamoDBORM('resources');
  const result = await resourcedb.create({ url: 'hogehoge' });
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

// 画像のハッシュpHashの各種ライブラリを試してみる
app.get('/checkimage_hashes', async (req: Request, res: Response, next: NextFunction) => {
  const srcDir = path.basename(path.dirname(__dirname));
  // 検証用で用意した画像たち
  // https://taptappun.s3.ap-northeast-1.amazonaws.com/sample_auto_filter.jpg
  // https://taptappun.s3.ap-northeast-1.amazonaws.com/sample_crop.jpg
  // https://taptappun.s3.ap-northeast-1.amazonaws.com/sample_origin.jpg
  // https://taptappun.s3.ap-northeast-1.amazonaws.com/sample_origin_small_size.jpg
  // https://taptappun.s3.ap-northeast-1.amazonaws.com/sample_sometime_filter.jpg
  // https://taptappun.s3.ap-northeast-1.amazonaws.com/sample_vertical.jpg
  const sample_origin_jpg = await jimp.read(path.join(srcDir, 'sample_images', 'sample_origin.jpg'));
  const sample_origin_small_size_jpg = await jimp.read(path.join(srcDir, 'sample_images', 'sample_origin_small_size.jpg'));
  const sample_sometime_filter_jpg = await jimp.read(path.join(srcDir, 'sample_images', 'sample_sometime_filter.jpg'));
  const sample_vertical_jpg = await jimp.read(path.join(srcDir, 'sample_images', 'sample_vertical.jpg'));
  const sample_crop_jpg = await jimp.read(path.join(srcDir, 'sample_images', 'sample_crop.jpg'));
  const sample_auto_filter_jpg = await jimp.read(path.join(srcDir, 'sample_images', 'sample_auto_filter.jpg'));
  res.json({
    // 16進数
    sample_origin_jpg: parseInt(sample_origin_jpg.pHash(), 2).toString(16),
    sample_origin_small_size_jpg: parseInt(sample_origin_small_size_jpg.pHash(), 2).toString(16),
    sample_sometime_filter_jpg: parseInt(sample_sometime_filter_jpg.pHash(), 2).toString(16),
    sample_vertical_jpg: parseInt(sample_vertical_jpg.pHash(), 2).toString(16),
    sample_crop_jpg: parseInt(sample_crop_jpg.pHash(), 2).toString(16),
    sample_auto_filter_jpg: parseInt(sample_auto_filter_jpg.pHash(), 2).toString(16),
  });
});

export const handler = serverlessExpress({ app });
