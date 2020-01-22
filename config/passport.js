const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
const Admin = require('../models/Admin');
const settings = require('../config/settings'); // get settings file


module.exports = passport => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = settings.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    Admin.findOne({id: jwt_payload.id}, (err, admin) => {
      if (err) {
        return done(err, false);
      }
      if (admin) {
        done(null, admin);
      } else {
        done(null, false);
      }
    });
  }));
};
