import express, { Application } from "express";
import cors from "cors";
import router from "./routes/routes";

const app: Application = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.listen("3000", () => {
  const date = new Date();
  console.log("server running.\n" + date);
});
