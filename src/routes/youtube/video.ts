import { NextFunction, Request, Response } from 'express';

const express = require('express');
const youtubeVideoRouter = express.Router();

youtubeVideoRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'twitter'});
});

youtubeVideoRouter.get('/search/videos', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'twitter'});
});

youtubeVideoRouter.get('/search/relationas', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'twitter'});
});

youtubeVideoRouter.get('/show', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

export { youtubeVideoRouter };