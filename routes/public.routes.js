import { Router } from "express";
import * as controller from "../controller/public.controller.js";

const router = Router();

router.get("/all-items", controller.getItem);
router.post("/new-order", controller.createOrder);

router.get("/", controller.redirectAdmin);

export default router;
