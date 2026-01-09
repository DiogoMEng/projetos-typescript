import Sequelize from 'sequelize';
import UserModel from './User.model';
import RoleModel from './Role.model';
import CategoryModel from './Category.model';
import BoxBottomModel from './BoxBottom.model';
import TransactionModel from './Transaction.model';
import RUBBModel from './RoleUserBoxBottom';


import {
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  NODE_ENV,
  DB_DIALECT
} from '../../config';

const sequelize = new Sequelize.Sequelize(
  DB_NAME as string,
  DB_USERNAME as string,
  DB_PASSWORD as string,
  {
    dialect: (DB_DIALECT as Sequelize.Dialect) || 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT as string, 10),
    timezone: '+09:00',
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      underscored: true,
      freezeTableName: true
    },
    pool: {
      min: 0,
      max: 5,
    },
    logQueryParameters: NODE_ENV === 'development',
    benchmark: true,
  }
);

sequelize.authenticate();

export const DB = {
  Users: UserModel(sequelize),
  Roles: RoleModel(sequelize),
  Categories: CategoryModel(sequelize),
  BoxBottoms: BoxBottomModel(sequelize),
  Transactions: TransactionModel(sequelize),
  RoleUserBoxBottoms: RUBBModel(sequelize),
  sequelize,
  Sequelize
}