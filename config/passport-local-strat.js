const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

// authenticaction using passport 

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//     },
//     function(email, password, done){
//         // find a user and establish the identity
//         User.findOne({email: email}, function (err, user){
//             if(err){
//                 console.log('Error in finding user -> Passport');
//                 return done(err);
//             }
//             if(!user || user.password != password){
//                 console.log('Invalid Username/password');
//                 return done(null, false);
//             }

//             return done(null, user);
//         })
//     }
// ));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
  },
  async function(req, email, password, done) {
    try {
      // Find a user and establish the identity
      const user = await User.findOne({ email: email });

      if (req.err){
        req.flash('error', err);
        return done(err);
      }
      if (!user || user.password != password) {
        req.flash('error', 'Invalid Username/password');
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      console.log('Error in finding user -> Passport', err);
      return done(err);
    }
  }
));

// serializing the user to decide which key is to be in kept in cookies 
passport.serializeUser(function(user,done){
    done(null, user.id);
});

// deserialzing the user from the key in the cookies
// passport.deserializeUser(function(id,done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log('Error in finding user -> Passport');
//             return done(err);
//         }

//         return done(null, user);
//     })
// });

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        // if (!user) {
        //     return done(null, false);
        // }
        return done(null, user);
    } catch (err) {
        console.log('Error in finding user -> Passport');
        return done(err);
    }
}); 


// check if the user authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user sign-in, then pass on the req to the next function (controller action)
    if(req.isAuthenticated()){
        return next();
    }
    // if te user not sign in 
    return res.redirect('/users/sign-In');
};

passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains current sign in user from session cookie and we are just sending locals for the views
        res.locals.user = req.user;
    }
    next();
};

module.exports = passport;