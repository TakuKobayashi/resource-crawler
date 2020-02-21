import 'source-map-support/register';

import { APIGatewayEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import * as express from 'express';

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
const server = awsServerlessExpress.createServer(app);
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ origin: true }));
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

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ hello: 'world' });
});

export const handler: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
