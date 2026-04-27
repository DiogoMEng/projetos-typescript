import bodyParser from 'body-parser';
import userRouter from './user.route';
import categoryRouter from './category.route';
import boxBottomRouter from './boxBottom.route';
import roleRouter from './role.route';
import transactionRouter from './transaction.route';
import RoleUserBoxBottomRouter from './roleUserBoxBottom.route';
import authRouter from './auth.route';
import { Application } from 'express';

export default (app: Application) => {
  app.use(
    bodyParser.json(),
  );
  app.use('/auth', authRouter);
  app.use('/users', userRouter);
  app.use('/categories', categoryRouter);
  app.use('/roles', roleRouter);
  app.use('/box-bottoms', boxBottomRouter);
  app.use('/transactions', transactionRouter);
  app.use('/role-user-box-bottoms', RoleUserBoxBottomRouter);
};