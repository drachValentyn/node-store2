const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Video = new Schema({
  video: {
    type: String,
    required: true
  },
  user: String
});

module.exports = mongoose.model('Video', Video);
