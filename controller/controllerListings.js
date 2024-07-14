//all callbacks stored.
const Listing = require("../models/listing");
//for mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
//access map token
const mapToken = process.env.MAP_TOKEN;
//creating base client
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ------------- 1. INDEX CALLBACK ------------- //
module.exports.index= async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

// ------------- 2. NEWFORM CALLBACK ------------- //
module.exports.renderNewForm = (req, res) => {
    res.render("listings/newform.ejs");
  }

// ------------- 3. SHOWLISTING CALLBACK ------------- //
module.exports.showListing = async (req, res) => {
    let { id } = req.params; //id aegi ko extract karenge
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner"); //listing ka data on basis of id found

    //if listing does not exist:
    if(!listing) {
      req.flash("error", "Listing does not exist!");
      res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  }

// ------------- 4. CREATE CALLBACK ------------- //
module.exports.createListing = async(req, res, next)=>{

    //geocoding basic code file copied and pasted 
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1, //limit means kitne coordinates
    })
    .send()
    

    let url = req.file.path; //url extract
    let filename = req.file.filename; //img file name extract
    console.log(url, "..", filename);

    // Create an instance of the Listing model as:
    const newListing = new Listing(req.body.listing);

    //for to save new owners info
    newListing.owner = req.user._id;

    //to save img file
    newListing.image = {url, filename}; //new listing me imgfile+url

    //to save map coordinates
    newListing.geometry = response.body.features[0].geometry;

    // Save the instance to the database
    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");

  }

// ------------- 5. EDIT CALLBACK ------------- //
module.exports.renderEditForm = async (req, res) => {
   
    //agar client listing me obj hi na bheje:
    // if(!req.body.listing){
    //   throw new ExpressError(400, "Send valid data for lising");
    //   //status code 400 means bc of client's galti server is not able to handle that req.
    // }
   
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if(!listing) {
      req.flash("error", "Listing does not exist!");
      res.redirect("/listings");
    }

    //before rendering edit form we want to show preview for low quality pixel img
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); //quality decreased as pixel size (by width)

    res.render("listings/editform.ejs", { listing, originalImageUrl });
  }

// ------------- 6. UPDATE CALLBACK ------------- //
module.exports.updateListing = async (req, res) => {
  
    //commented as new fn validateListing is added!
    // if(!req.body.listing){
    //   throw new ExpressError(400, "Send valid data for lising");
    //   //status code 400 means bc of client's galti server is not able to handle that req.
    // }
  
    let { id } = req.params; //extract id
    //extract listing & converting to individual params 
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //obj passed to deconstruct req.body.listing (JS obj jisme sare params hai)

    if(typeof req.file !== "undefined"){ //agar new img add nhi ki to kuch naya save nhi hoga. 
        //new IMAGE:
        let url = req.file.path; //url extract
        let filename = req.file.filename; //img file name extract

        //new img listing saved
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    
    res.redirect(`/listings/${id}`); //redirecting to SHOW route 
  }

// ------------- 7. DELETE LISTING CALLBACK ------------- //
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error", "Listing Deleted!");
    res.redirect("/listings");
}