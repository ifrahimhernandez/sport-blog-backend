import { Router, Request, Response, NextFunction } from "express";
import auth from "../middlewares/middleware";
import controller from "../controllers/user.controller";

const router: Router = Router();

router.get("/all", controller.allAccess);

router.get("/user", auth.verifyToken, controller.userBoard);

router.get("/mod", [auth.verifyToken, auth.validateRole('moderator')], controller.moderatorBoard);

router.get("/admin", [auth.verifyToken, auth.validateRole('admin')], controller.adminBoard);

export default router;
