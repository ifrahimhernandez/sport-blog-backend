import { Request, Response, NextFunction } from "express";
import { errorHandler } from '../helpers/error.handler';
import { db } from "../models";

const ROLES = db.ROLES;
const User = db.user;

const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = await User.findOne({ username: req.body.username })
    if (username) throw new Error("Failed! Username is already in use!");

    const email = await User.findOne({ email: req.body.email });
    if (email) throw new Error("Failed! Email is already in use!");

    next();

  } catch (error) {
    return errorHandler(error, req, res, null)
  }
};

const checkRolesExisted = async (req: Request, res: Response, next: NextFunction) => {
  if (req.body.roles) {
    req.body.roles.forEach((element: string) => {
      if (!ROLES.includes(element)) {
        res.status(400).send({
          message: `Failed! Role ${element} does not exist!`
        });
        return;
      }
    });
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

export { verifySignUp };
