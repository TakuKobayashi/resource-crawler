import { NextFunction, Request, Response } from 'express';

const express = require('express');
const niconicoThreedmodelRouter = express.Router();

niconicoThreedmodelRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

niconicoThreedmodelRouter.get('/search', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

export { niconicoThreedmodelRouter };