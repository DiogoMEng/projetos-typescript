import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import PaymentMethod from "../controllers/paymentMethod.controller";

const paymentMethodRouter = Router();
const control =  new PaymentMethod();

paymentMethodRouter.get("/show", authMiddleware, control.show.bind(control));
paymentMethodRouter.post("/create", authMiddleware, control.create.bind(control));
paymentMethodRouter.delete("/delete/:id", authMiddleware, control.delete.bind(control));
paymentMethodRouter.put("/update/:id", authMiddleware, control.update.bind(control));

export default paymentMethodRouter;
