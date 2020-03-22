const express = require("express");
const router = express.Router();
const fs = require("fs");
const moment = require("moment");
const json2csv = require("json2csv").parse;
const path = require("path");
const User = require("../models/User");

const fields = [
  {
    label: "User ID",
    value: "id"
  },
  {
    label: "User Name",
    value: "name"
  },
  {
    label: "User Login",
    value: "login"
  },
  {
    label: "User Email",
    value: "email"
  },
  {
    label: "Date",
    value: "date"
  }
];

router.get("/", function(req, res) {
  User.find(function(err, user) {
    if (err) {
      return res.status(500).json({ err });
    } else {
      let csv;
      try {
        csv = json2csv(user, { fields });
      } catch (err) {
        return res.status(500).json({ err });
      }

      const dateTime = moment().format("DD-MM-YYYY_hh:mm");
      const filePath = path.join(
        __dirname,
        "..",
        "public",
        "exports",
        "user-csv-" + dateTime + ".csv"
      );

      fs.writeFile(filePath, csv, function(err) {
        if (err) {
          return res.json(err).status(500);
        } else {
          console.log("Write csv successfully!");// eslint-disable-line no-console
          return res.json("user-" + dateTime + ".csv");
        }
      });
    }
  });
});

router.post("/", function(req, res, next) {
  User.insertMany(req.body, function(err, users) {
    if (err) res.json(err);
    res.json(users);
  });
});

module.exports = router;
