import { NextFunction, Request, Response } from 'express';

const express = require('express');
const flickrSearchRouter = express.Router();

flickrSearchRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

flickrSearchRouter.get('/search/images', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

export { flickrSearchRouter };
