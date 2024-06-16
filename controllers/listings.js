const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path: "author"},}).populate("owner"); 
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    let filename = req.file.filename;
    let url = req.file.path;
    newListing.image = {url,filename };
    newListing.owner = req.user._id;
    await newListing.save();

    // console.log(req.body);
    // console.log(req.file);
    req.flash("success", "New listing created!");
    res.redirect(`/listings`);
    
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
   
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
        let filename = req.file.filename;
        let url = req.file.path;
        listing.image = {url,filename };
        await listing.save()
    }
   
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

module.exports.searchListing = async (req, res) => {
    const { country } = req.query;
    if (!country) {
      return res.redirect('/listings');
    }
    const allListings = await Listing.find({ country: new RegExp(country, 'i') });
    res.render('listings/index.ejs', { allListings });
  };