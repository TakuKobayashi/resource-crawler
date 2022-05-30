import { NextFunction, Request, Response } from 'express';

const express = require('express');
const twitterSearchRouter = express.Router();

twitterSearchRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

twitterSearchRouter.get('/tweets', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

export { twitterSearchRouter };
