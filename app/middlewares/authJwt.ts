import { IGetUserAuthInfoRequest } from './../interfaces/userAuth.model';
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorHandler } from '../helpers/error.handler';
import { db } from "../models";

const User = db.user;
const Role = db.role;

const verifyToken = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    // Header names in Express are auto-converted to lowercase
    let token: any = req.headers['x-access-token'] || req.headers['authorization']; 

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, process.env.SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
};
const isAdmin = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const user: any = await User.findById(req.userId);
    if (!user) throw "User Not found.";

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles) throw "Roles Not found.";

    if (roles.some((role: any) => role.name === "admin")) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;

  } catch (error) {
    return errorHandler(error, req, res, null)
  }
};
const isModerator = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  try {
    const user: any = await User.findById(req.userId);
    if (!user) throw "User Not found.";

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles) throw "Roles Not found.";

    if (roles.some((role: any) => role.name === "moderator")) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Moderator Role!" });
    return;

  } catch (error) {
    return errorHandler(error, req, res, null)
  }

};

const authJwt = { verifyToken, isAdmin, isModerator };

export { authJwt }