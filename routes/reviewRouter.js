const wrapAsync = require("../utils/wrapAsync.js");


const express = require("express");
const ReviewRouter = express.Router({mergeParams: true});

const {validateReview, isLoggedIn, isReviewAuthor} = require("../AllValidateMiddleware.js");

//inluding controllers:
const reviewController = require("../controller/controllerReviews.js");

// --------------------------------------- 8. Reviews POST Request --------------------------------------->
//isLoggedIn passed to protect from req coming from backend like hoppscotch. 
ReviewRouter.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
  
  // --------------------------------------- 9. Reviews DELETE Route --------------------------------------->
  ReviewRouter.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync());

  module.exports = ReviewRouter;