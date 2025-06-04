import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import MonthlyGoal from "../controllers/monthlyGoal.controller";

const monthlygoalRouter = Router();
const control =  new MonthlyGoal();

monthlygoalRouter.get("/show", authMiddleware, control.show.bind(control));
monthlygoalRouter.post("/create", authMiddleware, control.create.bind(control));
monthlygoalRouter.delete("/delete/:id", authMiddleware, control.delete.bind(control));
monthlygoalRouter.put("/update/:id", authMiddleware, control.update.bind(control));

export default monthlygoalRouter;
