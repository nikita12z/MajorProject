const express = require("express");
const UserSignupRouter = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../AllValidateMiddleware.js");

//include controller
const userController = require("../controller/controllerSignupUser.js");

//better formatting of routers:
UserSignupRouter
    .route("/signup")
        // -------------- SignUp user ---------------->
        // Get request
        .get(userController.renderSignupForm)
        //Post request
        .post(wrapAsync(userController.signup));
    
UserSignupRouter
    .route("/login")
        // -------------- Login User -------------->
        //GET req
        .get(userController.renderLoginForm)

        //POST req     for authentication, done by passport
        //passport does that work as a middleware
        .post(saveRedirectUrl,
            passport.authenticate("local", 
                {   //failureFlash means on failure with authentication, flash msg will be shown. 
                    failureRedirect: '/login', 
                    failureFlash: true 
                }), userController.login); //this login is successful login ke baad kya karna hai for that.
        //actual login is done by passport only.

// -------------- Logout User -------------->
UserSignupRouter.get("/logout", userController.logout);

module.exports = UserSignupRouter;