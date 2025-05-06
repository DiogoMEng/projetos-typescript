import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";
import { errorMiddleware } from "./middlewares/error";

class App {
  public readonly app: Application

  constructor () {
    this.app = express();
    this.routes();
    this.middleware();
  }

  middleware() {
    
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors())
    this.app.use(errorMiddleware);

  }

  routes() {
    this.app.use(router)
  }
}

export default new App().app;
