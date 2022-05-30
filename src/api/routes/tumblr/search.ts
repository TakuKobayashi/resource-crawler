import { NextFunction, Request, Response } from 'express';

const express = require('express');
const tumblrSearchRouter = express.Router();

tumblrSearchRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

tumblrSearchRouter.get('/resources', (req: Request, res: Response, next: NextFunction) => {
  res.json({ hello: 'world' });
});

export { tumblrSearchRouter };
