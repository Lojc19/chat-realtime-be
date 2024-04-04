const express = require("express");
const router = express.Router();
const { loginUser, signupUser, logout} = require("../controllers/auth.controller");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logout);


module.exports = router;