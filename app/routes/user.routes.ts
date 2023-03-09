import { Router, Request, Response, NextFunction } from "express";
import { authJwt } from "../middlewares";
import {
  allAccess,
  userBoard,
  moderatorBoard,
  adminBoard,
} from "../controllers/user.controller";

const router: Router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.get("/all", allAccess);

router.get("/user", [authJwt.verifyToken], userBoard);

router.get(
  "/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  moderatorBoard
);

router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

export default router;
