import { IGetUserAuthInfoRequest } from '../interfaces/userAuth.model';
import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { config } from '../config/configs';
import Logging from '../library/logging';
import User from '../models/user.model';
import Role from '../models/role.model';

const verifyToken: any = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  // Header names in Express are auto-converted to lowercase
  let token: any = req.headers['x-access-token'] || req.headers['authorization'];

  // Remove Bearer from string
  token = token.replace(/^Bearer\s+/, "");
  if (!token) return res.status(403).send({ message: "No token provided!" });

  jwt.verify(token, config.server.secret, (err: any, decoded: any) => {
    if (err) return res.status(401).send({ message: "Unauthorized!" });
    req.userId = decoded.id;
    next();
  });
};

const validateRole: any = (activeRole: string) => {
  return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      const user: any = await User.findById(req.userId);
      if (!user) return res.status(404).send({ message: "User Not found." });

      const roles = await Role.find({ _id: { $in: user.roles } });
      console.log(roles)
      if (!roles || !roles.some((role: any) => role.name === activeRole)) return res.status(404).send({ message: "Error: Please check user role." });

      next();
    } catch (error) {
      Logging.error(error);
      return res.status(422).json({ error });
    }
  };
}

const checkDuplicateUsernameOrEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email } = req.body;

  const userResponse = await User.findOne({ username: username })
  if (userResponse) return res.status(400).json({ message: "Failed! Username is already in use!" });

  const emailResponse = await User.findOne({ email: email });
  if (emailResponse) return res.status(400).json({ message: "Failed! Email is already in use!" });

  next();
};

const checkRolesExisted = (req: Request, res: Response, next: NextFunction) => {
  const { roles } = req.body;

  if (roles.length === 0) {
    return res.status(400).send({ message: "Failed! List of roles should have one role!" });
  } else if (!doAllRolesExist(roles, config.server.roles)) {
    return res.status(400).send({ message: "Failed! Role does not exist!" });
  } else {
    next();
  }
};


const doAllRolesExist = (rolesToCheck: Array<String>, allRoles: Array<String>) => {
  return rolesToCheck.every(role => allRoles.includes(role));
}


export default { verifyToken, validateRole, checkDuplicateUsernameOrEmail, checkRolesExisted };