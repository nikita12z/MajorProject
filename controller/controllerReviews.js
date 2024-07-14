const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");


// 8. REVIEWS POST REQ
module.exports.createReview = async(req, res) => {
  
    //accessing listing whose id we get
     let listing = await Listing.findById(req.params.id);
     let newReview = new Review(req.body.review); //comes from review[comment] & review[rating]

     newReview.author = req.user._id; //authorid now associated with every new review

     listing.reviews.push(newReview);
  
     await newReview.save();
     await listing.save();
  
     console.log("new review saved");

     req.flash("success", "New Review Created!");

     res.redirect(`/listings/${listing._id}`);
  
  }

// 9. REVIEWS DELETE REQ
module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
  
    //review array mese delete karne ke liye:
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
  
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
  }