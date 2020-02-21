import { NextFunction, Request, Response } from 'express';

const express = require('express');
const googleMapRouter = express.Router();

googleMapRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

googleMapRouter.get('/geocode', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

googleMapRouter.get('/places', (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'});
});

export { googleMapRouter };