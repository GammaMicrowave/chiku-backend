import { Router } from "express";
import * as controller from "../controller/admin.controller.js";

export default function adminRouter(passport) {
  const router = Router();

  function authRequired(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/admin");
  }

  router.get("/home", authRequired, controller.getHome);
  router.get("/items", authRequired, controller.getItems);
  router.get("/orders", controller.getOrder);

  router.post("/new-item", authRequired, controller.createItem);
  router.post("/update-item", authRequired, controller.updateItem);
  router.post("/delete-item", authRequired, controller.deleteItem);
  
  router.post("/accept-order", authRequired, controller.acceptOrder);
  router.post("/reject-order", authRequired, controller.rejectOrder);
  router.post('/deliver-order', authRequired, controller.deliveredOrder);
  router.get("/", controller.getLogin);
  router.post(
    "/",
    passport.authenticate("local", {
      successRedirect: "/admin/home",
      failureRedirect: "/admin",
    })
  );
  

  return router;
}