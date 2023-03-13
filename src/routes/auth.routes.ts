import { Schemas, ValidateJoi } from './../middlewares/joi';
import { Router, Request, Response, NextFunction } from "express";
import controller from "../controllers/auth.controller";
import auth from "../middlewares/middleware";


const router: Router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup", [ValidateJoi(Schemas.auth.signUp), auth.checkDuplicateUsernameOrEmail, auth.checkRolesExisted], controller.signUp);
router.post("/signin", ValidateJoi(Schemas.auth.signIn), controller.signIn);

export default router;