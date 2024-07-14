//for listings
const { listingSchema } = require("./validateschema.js");
const ExpressError = require("./utils/ExpressError.js");

//for reviews
const { reviewSchema } = require("./validateschema.js");
const Review = require("./models/reviews.js");

const Listing = require("./models/listing.js");

module.exports.isLoggedIn = (req, res, next) =>{
    
    if (!req.isAuthenticated()){

        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must be logged in to create a lisitng!");
        return res.redirect("/login");
    }  
    next();

};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//authorization
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params; //extract id
    //for owner & current user authorization from hoppscotch side
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){ //locals wala current user
      req.flash("error", "You are not owner of this listing :/ ");
      return res.redirect(`/listings/${id}`);
    }

    next();
};

//validate listing middleware
//making a fn to convert validations for schema into middlewares:
module.exports.validateListing = (req, res, next)=>{
    // ---------------- Validations for Schema HERE using JOI --------------
    let {error} = listingSchema.validate(req.body);
  
    //throwing new error
    if(error){
  
    //jo bhi errors print hue wo obj ke form me hai. use extract karenge by creating a variable called errMsg
    //errMsg me sare details map karenge uskeliye jo individual elements hai, unkeliye return karenge individual msg & unhe join karenge with help of ","
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400, error);
  
    }else{
      next();
    }
  };

//validate reviews middleware
//making a fn to convert validations for schema into middlewares:

module.exports.validateReview = (req, res, next)=>{
  // ---------------- Validations for Schema HERE using JOI --------------
  let {error} = reviewSchema.validate(req.body);

  //throwing new error
  if(error){

  //jo bhi errors print hue wo obj ke form me hai. use extract karenge by creating a variable called errMsg
  //errMsg me sare details map karenge uskeliye jo individual elements hai, unkeliye return karenge individual msg & unhe join karenge with help of ","
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, error);

  }else{
    next();
  }
};

//to delete reviews, first user is authorised 
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params; //extract is & reviewid
  //for owner & current user authorization from hoppscotch side
  let review = await Review.findById(reviewId);
  if(!review.author._id.equals(res.locals.currUser._id)){ //locals wala current user
    req.flash("error", "You are not author of this review :/ ");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

