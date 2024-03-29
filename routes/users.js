const express = require("express");
const router = express.Router()
const passport = require('passport');

const usersCntroller = require('../controllers/users_controller');

router.get('/profile/:id',passport.checkAuthentication, usersCntroller.profile);

router.post('/update/:id',passport.checkAuthentication, usersCntroller.update);

router.get('/sign-up',usersCntroller.signUp);

router.get('/sign-In',usersCntroller.signIn);

router.post('/create',usersCntroller.create);

// router.post('/create_session', usersCntroller.create_session);

router.post('/createSession', passport.authenticate(
    'local', 
    {failureRedirect:'/users/sign-In'}
),usersCntroller.createSession);

router.get('/sign-out',usersCntroller.destroySession);

module.exports = router;