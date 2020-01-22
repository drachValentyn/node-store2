const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
require("../config/passport")(passport);

const getToken = headers => {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

/* GET ALL Users */
router.get("/", passport.authenticate("jwt", { session: false }), function(
  req,
  res,
  next
) {
  const token = getToken(req.headers);
  if (token) {
    User.find((err, user) => {
      if (err) return next(err);
      res.json(user);
    });
  } else {
    return res.status(403).send({ success: false, msg: "Unauthorized." });
  }
});

/* GET SINGLE User BY ID */
router.get("/:id", (req, res, next) => {
  User.findById(req.params.id, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

/* SAVE User */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    const token = getToken(req.headers);
    if (token) {
      User.create(req.body, (err, post) => {
        if (err) return next(err);
        res.json(post);
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

/* UPDATE User */
router.put("/:id", (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE User */
router.delete("/:id", (req, res, next) => {
  User.findByIdAndRemove(req.params.id, req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
