import { NextFunction, Request, Response } from 'express';

const express = require('express');
const niconicoImageRouter = express.Router();

niconicoImageRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

niconicoImageRouter.get('/search', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

export { niconicoImageRouter };