const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String, 
    filename: String,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", //ref ke liye review model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
  },
  // category: {
  //   type: String,
  //   enum: ["mountains", "arctic", "farms", "desserts"]
  // }
});

// Default image URL
// const defaultImageUrl = "https://plus.unsplash.com/premium_photo-1663133679087-bc5deb50ab00?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2h8ZW58MHx8MHx8fDA%3D"; // Replace with your actual default image URL

// // Pre-save middleware to set default image URL if not provided
// listingSchema.pre("save", function (next) {
//   if (!this.image.url) {
//     this.image.url = defaultImageUrl;
//   }
//   next();
// });

//Mongoose middleware for when listing is delted, its reviews must also get deleted!
listingSchema.post("findOneAndDelete", async(listing) =>{ //us listing ka data aega jo delte hone wali hai bc we used "findOneAndDelete"
  if(listing) { //condition ki agar koi listing aai hai
    await Review.deleteMany({_id: {$in : listing.reviews}}); //listing.reviews me jitne bhi review ids hai, unki ek list bana lenge, and if _id un ids ka part hongi to wo id wala pura review hamare liye delete ho jaega
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
