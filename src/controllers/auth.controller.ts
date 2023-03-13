import { IUserModel } from './../models/user.model';
import { config } from './../config/configs';
import { NextFunction, Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/user.model';
import Role from '../models/role.model';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, first_name, last_name, roles } = req.body;
  let foundRoles: any = [];

  if (roles) {
    const roleResponse = await Role.find({ name: { $in: roles } });
    if (roleResponse.length === 0) return res.status(400).json({ message: "Role does not exist" });
    foundRoles = roleResponse.map((role: any) => role._id);
  }

  const user = new User({
    username, email, first_name, last_name,
    password: bcrypt.hashSync(password, 8),
    roles: foundRoles.length > 0 ? foundRoles : ["user"]
  });

  return user
    .save()
    .then((user: IUserModel) => res.status(201).json({
      type: "success",
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email
    }))
    .catch((error) => res.status(500).json({ error }));
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username }).populate("roles", "-__v");
  if (!user) return res.status(404).json({ message: "User Not found." });

  const passwordIsValid = bcrypt.compareSync(
    password,
    user.password
  );
  if (!passwordIsValid) return res.status(401).json({ accessToken: null, message: "Invalid Password!" });

  const token = jwt.sign({ id: user.id }, config.server.secret, {
    expiresIn: 86400 // 24 hours
  });

  res.status(200).send({
    id: user._id,
    type: "success",
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    roles: user.roles.map((role: any) => "ROLE_" + role.name.toUpperCase()),
    accessToken: token
  });
};

export default { signUp, signIn };