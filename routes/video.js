const fs = require('fs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const {Worker, isMainThread} = require('worker_threads');
const Video = require('../models/Video');
const upload = require('../multer/storageVideo');


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


router.get('/',
  passport.authenticate('jwt', { session: false}),
  (req, res) => {
  let token = getToken(req.headers);
  if (token) {
    Video.find({
      user: req.query.user
    },
      function (err, videos) {
      if (err) return next(err);
      res.json(videos);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.post('/', passport.authenticate('jwt', {session: false}),
  (req, res) => {
    let token = getToken(req.headers);
    if (token) {
      upload(req, res, function (err) {
        if (req.file === null || req.file === undefined || req.file === "") {
          res.json('No Image Set');
        } else {
          if (err) {
            console.log(err);
          } else {
            if (isMainThread) {
              let thread = new Worker('./threads/thread_watermark.js',
                {
                  workerData: {
                    file: req.file.path,
                    filename: req.file.filename,
                  }
                });

              thread.on('message', (data) => {
                res.download(data.file, req.file.filename);

                let video = new Video();
                video.video = req.file.filename;
                video.user = req.query.user;

                video.save(() => {
                  if (err) return next(err);
                  res.json(req.file.filename);
                });

              });

              thread.on("error", (err) => {
                console.error("thread", err);
              });

              thread.on('exit', (code) => {
                if (code !== 0)
                  console.error(`Worker stopped with exit code ${code}`)
              });
            }
          }
        }
      });
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });


module.exports = router;
