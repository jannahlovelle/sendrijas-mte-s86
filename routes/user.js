const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

const bcrypt = require("bcryptjs"); 
const {isLoggedIn, verify} = require("../auth");



router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.post("/check-email", userController.checkEmailExists);

module.exports = router;