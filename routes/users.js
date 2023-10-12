const express = require("express");
const router = express.Router()

const usersCntroller = require('../controllers/users_controller');

router.get('/profile',usersCntroller.profile);

module.exports = router;