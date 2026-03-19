import bodyParser from 'body-parser';
import userRouter from './user.route';
import categoryRouter from './category.route';
import boxBottomRouter from './boxBottom.route';
import roleRouter from './role.route';
import transactionRouter from './trasaction.route';
import RoleUserBoxBottomRouter from './roleUserBoxBottom.route';
import { Application } from 'express';

export default (app: Application) => {
  app.use(
    bodyParser.json(),
    userRouter,
    categoryRouter,
    boxBottomRouter,
    roleRouter,
    transactionRouter,
    RoleUserBoxBottomRouter
  )
}