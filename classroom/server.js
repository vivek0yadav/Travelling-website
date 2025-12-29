const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash")
const path=require('path')
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionOption={
    secret:"mysupersecreting",
    resave:false,
    saveUninitialized:true,
};
app.use(session(sessionOption));
app.use(flash());
app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    req.flash("success","user registered successfully!");
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    res.locals.message=req.flash("success")
    res.render("page.ejs",{name:req.session.name});
})

app.listen(3000,()=>{
    console.log(`server is working on 3000`);
})