//dotenv included
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
//mongostore requires
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
//passport imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//Routers:
const ListingRouter = require("./routes/listingRouter.js");
const ReviewRouter = require("./routes/reviewRouter.js");
const UserSignupRouter = require("./routes/signupUserRouter.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //req me jo data aa rha hai wo parse ho paye
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
//to use static files
app.use(express.static(path.join(__dirname, "/public")));

//For MongoStore: ---------------------->
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { //for encryption
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //means data stored in DB for 24hrs
});

store.on("error", ()=>{
  console.log("ERROR in MONGO SESSION STORE", err);
});

//defining session options:
const sessionOptions = {
  //passing store info in this
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 1000, //expires after 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());
//implementing passport
app.use(passport.initialize());
app.use(passport.session());
//jo bhi users aye jitne bhi reqs aye, wo sare users LocalStrategy ke thru authenticate hone cahiye & un 
//users ko authenticate(login/signup) akrne ke liye authenticate() method ko use karenge, jo ek static method hai defined by passport local mongoose.
passport.use(new LocalStrategy(User.authenticate())); 
//passport user ko serialize and deserialize karta hai as:
//serialize: user ke related info store karana.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to define locals
//flash middleware:
app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async(req, res)=>{

//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);

// });


//using routers:
app.use("/listings", ListingRouter);
app.use("/listings/:id/reviews", ReviewRouter);
app.use("/", UserSignupRouter);

// ****************************************************** ROUTES ******************************************************************** //









// ****************************************************** ERRORS AREA ******************************************************************** //

//custom error for all routes other than defined ones. all=*
// a. error throw kia
app.all("*", (req, res, next)=>{
  next(new ExpressError(404, "Page not found!"));
});

//defining a middleware for error handling
//throwing express error:
// b. idhar error catch kia
app.use((err, req, res, next)=>{
  //deconstruct expresserror.
  let {statusCode=500, message="Something went wrong!"} = err;
  res.status(statusCode).render("errorstyle.ejs", {err});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});



// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");


// //connection established
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main()
//     .then(()=>{
//         console.log("connected to db");
//     })
//     .catch((err)=>{
//         consoel.log(err);
//     });

//     async function main(){
//         await mongoose.connect(MONGO_URL);
//     }

// // 1. ROOT ROUTE
// app.get("/", (req, res)=>{
//     res.send("im root");
// });

// // 2. INDEX ROUTE
// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   });

// // 2. TEST LISTING ROUTE
// // app.get("/testListing", async (req, res)=>{
// //     let sampleListing = new Listing({
// //         title: "New Villa",
// //         description: "By the beach",
// //         price: 1200,
// //         location: "Goa",
// //         country: "India",
// //     });

// //     //saving to DB
// //     await sampleListing.save();
// //     console.log("sample saved");
// //     res.send("success");
// // });

// app.listen(8080, ()=>{
//     console.log("listening to port 8080");
// });
