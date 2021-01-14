const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const HttpError = require('../models/http-error');
const User = require('../models/user');

const login = async (req, res, next) => {
    const { username, password } = req.body;
  
    let existingUser;
  
    try {
      existingUser = await User.findOne({ username: username });
    } catch (err) {
      const error = new HttpError(
        "Loggin in failed, please try again later.",
        500
      );
      return next(error);
    }
  
    if (!existingUser) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    }
  
    let isValidPassword;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
      return next(
        new HttpError(
          "Could not log you in, please check credentials and try again!",
          500
        )
      );
    }
  
    if (!isValidPassword) {
      const error = new HttpError(
        "Invalid credentials, could not log you in.",
        403
      );
      return next(error);
    }
  
    let token;
    try{
      token = jwt.sign({
        userId : existingUser.id ,
        username : existingUser.username,
        role: existingUser.role
      },
      'supersecret_dont_share',
      {expiresIn : '4h'});
    }catch(err) {
      return next(new HttpError("Login failed, please try again later!",500));
    }
  
    res.json({
      userId : existingUser.id ,
      username : existingUser.username,
      role: existingUser.role,
      token : token
    });
  };

  exports.login = login;
  