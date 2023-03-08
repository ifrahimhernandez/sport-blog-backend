const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    // Header names in Express are auto-converted to lowercase
    let token = req.headers['x-access-token'] || req.headers['authorization']; 

    // Remove Bearer from string
    token = token.replace(/^Bearer\s+/, "");

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.userId = decoded.id;
      next();
    });
};

isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw "User Not found.";

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles) throw "Roles Not found.";

    if (roles.some(role => role.name === "admin")) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;

  } catch (error) {
    return errorHandler(error, req, res, null)
  }
};

isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) throw "User Not found.";

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (!roles) throw "Roles Not found.";

    if (roles.some(role => role.name === "moderator")) {
      next();
      return;
    }

    res.status(403).send({ message: "Require Moderator Role!" });
    return;

  } catch (error) {
    return errorHandler(error, req, res, null)
  }

};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
