if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const PORT = process.env.PORT || 8080;
const express=require('express')
const app=express();
const mongoose=require('mongoose')

const path=require('path')
const methodoverride=require('method-override');
app.use(methodoverride("_method"));
const ejsMate=require('ejs-mate');
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Listing=require("./models/listing.js")
const session=require("express-session");
const flash=require("connect-flash");
//authentication session
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const Review = require("./models/review.js");
//express router 
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
//connection of mongo DB
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions={
    secret:"mysupersecreting",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};
app.get("/",(req,res)=>{
    // res.send(" server is working")
    res.redirect("/listings");
});
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});
//demo user for demo 
// app.get("/demo",async(req,res)=>{
//     let fakeUser={
//         email:"abc@gmail.com",
//         username:"vivek"
//     }
//     let demoUser=await User.register(fakeUser,"helloworld");
//     res.send(demoUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Somthings is wrong!"}=err;
    res.render("error.ejs",{err});
    //res.status(statusCode).send(message);
});

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${8080}`);
})