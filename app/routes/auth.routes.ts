import { Router, Request, Response, NextFunction } from "express";
import { verifySignUp } from "../middlewares";
import { signup, signin } from "../controllers/auth.controller";

const router: Router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  signup
);

router.post("/signin", signin);

export default router;