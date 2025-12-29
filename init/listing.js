const mongoose=require('mongoose')
const Listing=require("../models/listing.js")
const initdata=require("./data.js");
const { object } = require('joi');
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err);
});
async function main() {
    await mongoose.connect(MONGO_URL);
}
const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"687b7873e95c60a5e43a876f"}));
    await Listing.insertMany(initdata.data);
    console.log("Data inserted")
}
initDB();