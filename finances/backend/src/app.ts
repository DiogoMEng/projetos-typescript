import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes/routes";

class App {
  public readonly app: Application

  constructor () {
    this.app = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors())
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

      return res.status(500).json({ message: err.message });

    })

  }

  routes() {
    this.app.use(router)
  }
}

export default new App().app;
