import { NextFunction, Request, Response } from 'express';

const express = require('express');
const niconicoVideoRouter = express.Router();

niconicoVideoRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

niconicoVideoRouter.get('/show', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

niconicoVideoRouter.get('/search', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

niconicoVideoRouter.get('/search/live', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

export { niconicoVideoRouter };