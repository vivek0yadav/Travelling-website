const Listing=require("../models/listing");
module.exports.index=async(req,res)=>{
    const allListing=await Listing.find({});
    res.render("listings/index.ejs",{allListing});
}
module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
            populate:{
                path:"author",    
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let newlisting=new Listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","Listing has added!");
    res.redirect("/listings");
}
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing not exists!");
        return res.redirect("/listings");
    }
    let originalImageurl=listing.image.url;
    originalImageurl = originalImageurl.replace("/upload/", "/upload/w_150,h_150,c_fill/");
    res.render("listings/edit.ejs",{listing , originalImageurl});
}
module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image = { url , filename }
        await listing.save();
    }
    req.flash("success","Listing has Updated!");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params
   let deletone= await Listing.findByIdAndDelete(id);
   req.flash("success","Listing has Deleted!");
   //console.log(deletone);
   res.redirect("/listings");
}