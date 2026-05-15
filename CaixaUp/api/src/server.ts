import express from 'express';
import cors from 'cors';
import router from './routes/indexRouter.js';
import { DB } from './database/models/index.js';
import { PORT } from './config';

const appServer = express();
appServer.use(cors({
  origin: 'http://localhost:8080',
}));
const port = PORT || 3000;

appServer.use(express.json());
appServer.use(express.urlencoded({ extended: true }));

router(appServer);

appServer.all('*', (req, res) => {
  res.status(404).json({ message: `Route ${req.path} not found.` });
});

DB.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
    appServer.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });