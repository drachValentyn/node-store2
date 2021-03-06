const path = require("path");
const multer = require("multer");

let storageVideo = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadVideo = multer({storage: storageVideo}).single("file");

module.exports = uploadVideo;
