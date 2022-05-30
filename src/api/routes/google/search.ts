import { NextFunction, Request, Response } from 'express';

const express = require('express');
const googleSearchRouter = express.Router();

googleSearchRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

googleSearchRouter.get('/search/videos', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

googleSearchRouter.get('/search/relationas', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

googleSearchRouter.get('/show', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

export { googleSearchRouter };
