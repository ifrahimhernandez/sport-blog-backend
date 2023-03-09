import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { errorHandler } from '../helpers/error.handler';
import { db } from "../models";

const User = db.user;
const Role = db.role;

export const signup = async (req: Request, res: Response) => {
  try {
    const user: any = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8)
    });

    await user.save();

    if (req.body.roles) {
      const roleResponse = await Role.find({ name: { $in: req.body.roles } });
      user.roles = roleResponse.map((role: any) => role._id);
    } else {
      const roleResponse = await Role.findOne({ name: "user" });
      user.roles = [roleResponse._id];
    }
    await user.save();
    res.status(200).send({ message: "User was registered successfully!" });
  } catch (error) {
    return errorHandler(error, req, res, null)
  }
};

export const signin = async (req: Request, res: Response) => {

  try {
    if (req.body.username === undefined || req.body.password === undefined) throw "Error: Missing required parameters."

    const user: any = await User.findOne({ username: req.body.username }).populate("roles", "-__v");
    if (!user) throw "User Not found.";

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) throw "Invalid Password!";

    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles.map((role: any) => "ROLE_" + role.name.toUpperCase()),
      accessToken: token
    });

  } catch (e) {
    return errorHandler(e, req, res, null)
  }
};
