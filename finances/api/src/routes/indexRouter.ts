import bodyParser from 'body-parser';
import userRouter from './userRouter';
import { Application } from 'express';

export default (app: Application) => {
  app.use(
    bodyParser.json(),
    userRouter,
  )
}