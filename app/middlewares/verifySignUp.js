const errorHandler = require("../helpers/error.handler");
const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
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

checkRolesExisted = async (req, res, next) => {
  if (req.body.roles) {
    req.body.roles.forEach(element => {
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

module.exports = verifySignUp;
