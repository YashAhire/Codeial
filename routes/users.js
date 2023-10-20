const express = require("express");
const router = express.Router()

const usersCntroller = require('../controllers/users_controller');

router.get('/profile',usersCntroller.profile);

router.get('/sign-up',usersCntroller.signUp);

router.get('/sign-In',usersCntroller.signIn);

router.post('/create',usersCntroller.create);

module.exports = router;