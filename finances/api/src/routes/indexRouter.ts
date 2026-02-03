import bodyParser from 'body-parser';
import userRouter from './user.router';
import categoryRouter from './category.router';
import { Application } from 'express';

export default (app: Application) => {
  app.use(
    bodyParser.json(),
    userRouter,
    categoryRouter,
  )
}