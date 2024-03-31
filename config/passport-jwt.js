const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Codeial'
}

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne(jwt_payload._id, function(err, user) {
        
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
        if(err){
            return done(err, false);
        }
    });
}));

module.exports = passport;