import { Router } from "express";
import TokenController from "../controllers/token.controller";

const tokenRouter = Router();
const control =  new TokenController();

tokenRouter.post("/", control.login.bind(control));

export default tokenRouter;
