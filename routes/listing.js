const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

//all listing data---index route and post listing route--------------------------->
router.route("/")
    .get(listingController.index)
    .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing));

//add new listing data new route --------------------------->
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show route for individual item----------------------------->
//update route---------------------------------->
//delete route----------------------->

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;
