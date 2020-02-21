import { NextFunction, Request, Response } from 'express';

const express = require('express');
const instagramSearchRouter = express.Router();

instagramSearchRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

instagramSearchRouter.get('/search/tags', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

export { instagramSearchRouter };