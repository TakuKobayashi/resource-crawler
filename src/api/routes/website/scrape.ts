import { NextFunction, Request, Response } from 'express';

const express = require('express');
const websiteScrapeRouter = express.Router();

websiteScrapeRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

websiteScrapeRouter.get('/resources', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

websiteScrapeRouter.get('/links', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

export { websiteScrapeRouter };
