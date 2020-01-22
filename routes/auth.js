const mongoose = require('mongoose');
const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Admin = require("../models/Admin");


router.post('/register', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    const newAdmin = new Admin({
      username: req.body.username,
      password: req.body.password
    });
    // save the user
    newAdmin.save(function(err) {
      if (err) {
        return res.json({
          success: false,
          msg: 'Username already exists.',
          res: res,
          admin: newAdmin
        });
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});


router.post('/login', (req, res) =>{
  Admin.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password,  (err, isMatch) => {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          const token = jwt.sign(user.toJSON(), settings.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

module.exports = router;
