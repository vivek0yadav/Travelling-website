const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js")
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js")
//render sign up form by using router.route
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup))

// router.get("/signup",userController.renderSignupForm);
// //save the user throw the sign up form
// router.post("/signup",wrapAsync(userController.signup));
//render login form
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    userController.login
)
// router.get("/login",userController.renderLoginForm);
// //check login user 
// router.post("/login",saveRedirectUrl,
//     passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
//     userController.login
// );
//logout user
router.get("/logout",userController.logout);

module.exports=router;