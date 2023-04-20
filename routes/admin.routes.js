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

    router.post("/new-item", authRequired, controller.createItem);
    router.post("/update-item", authRequired, controller.updateItem);
    router.post("/delete-item", authRequired, controller.deleteItem);

    router.get("/", controller.getLogin);
    router.post("/", passport.authenticate("local", {
        successRedirect: "/admin/home",
        failureRedirect: "/admin"
    }));

    return router;
}

