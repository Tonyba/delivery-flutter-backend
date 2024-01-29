const jwt = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const key = process.env.JWT_KEY;

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = extractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = key;

    passport.use(new jwt(opts,(payload, done) => {
            User.findById(payload.id, (err,user) => {
                if(err) {
                    return done(err, false);
                }

                if(user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        })
    );
}