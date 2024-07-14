//path is going to change from ./ to ../ as this file is in diff folder

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");

const express = require("express");
const ListingRouter = express.Router(); //ListingRouter is object

//loggedin, isowner,  authentication
const {isLoggedIn, isOwner, validateListing} = require("../AllValidateMiddleware.js");

//requiring controllers:
const ListingController = require("../controller/controllerListings.js");

//for MULTER PACKAGE, img uploading
const multer  = require('multer')
//cloud config import
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); //multer stores data in clodinary ka "storage"

//reformat routers:
ListingRouter
  .route("/")
    // --------------------------------------- 1. Index Route --------------------------------------->
    .get(wrapAsync(ListingController.index))

    // --------------------------------------- 3. Create Route (new lisiting created) --------------------------------------->
                //validateListing se pehle valdiate kia jaega listing ko fir hi aage ke kaam karenge. 
    .post(isLoggedIn,
      //extracting variables as: 
      //req.body pe console prints a JS object as {listing:{key val pairs}}
      //req.body.listing pe listing obj print hogi as {key val pairs}
      
      upload.single('listing[image]'), //img middleware to save img on cloud
      // link/url stored in this req.file obj
      validateListing,
      //wrapAsync function added:
      wrapAsync(ListingController.createListing)

    );

// --------------------------------------- 3. New Route --------------------------------------->
//why is 3rd before 2nd? app.js "new" ko ek id samaz rha tha isiliye error. so we put it before id route. 
ListingRouter.get("/new", isLoggedIn, ListingController.renderNewForm);

ListingRouter
  .route("/:id")
    // --------------------------------------- 2. Show Route --------------------------------------->
    .get(wrapAsync(ListingController.showListing))

    // --------------------------------------- 5. Update Route --------------------------------------->
    .put(isLoggedIn, isOwner,       
      upload.single('listing[image]'), //img middleware to save img on cloud
      validateListing,
      wrapAsync(ListingController.updateListing))

    // --------------------------------------- 6. Delete Route --------------------------------------->
    .delete(isLoggedIn, isOwner, wrapAsync(ListingController.destroyListing));

// --------------------------------------- 4. Edit Route --------------------------------------->
ListingRouter.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));
  
module.exports = ListingRouter;