const express=require("express");
const router =express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl,isLoggedIn,isOwner}=require("../middleware.js");
const userController= require("../controller/users.js");

router.route("/signUp")
.get(userController.renserSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login").get(userController.renderLoginForm).post(saveRedirectUrl, 
    passport.authenticate("local", {failureRedirect: "/login",failureFlash: true}), userController.login);

    router.get("/logout", userController.logout);
    
    module.exports=router;


