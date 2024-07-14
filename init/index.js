//DB ko initialize karne ka kaam karta hai. 

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    });

    async function main(){
        await mongoose.connect(MONGO_URL);
    }

const initDB = async () => {
  await Listing.deleteMany({}); //deleting random data
  //map prop creates new array which is aved in initData.data
  initData.data = initData.data.map((obj) => ({...obj, owner: "6692a0a1006a2ef2717af195" })); //har ek obj ke andar jake ek nayi prop ko add kar dega with an owner
  await Listing.insertMany(initData.data); //data: key initData: object
  console.log("data was initialized");
};

initDB();