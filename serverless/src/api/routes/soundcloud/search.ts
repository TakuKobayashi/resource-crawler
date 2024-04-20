import { NextFunction, Request, Response } from 'express';

const express = require('express');
const soundcloudSearchRouter = express.Router();

soundcloudSearchRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

soundcloudSearchRouter.get('/resources', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

export { soundcloudSearchRouter };
