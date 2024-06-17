require('dotenv').config(); // Ensure to load environment variables

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wandelust";

const dbUrl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connected to db");
}
main().catch((err) => {
    console.error("Error connecting to db", err);
}); 


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
});

// main().then(() => {
//     console.log("Connected to db");
// }) .catch ((err) => {
//     console.log(err); 
// })

// async function main() {
//     await mongoose.connect(MONGO_URL);
// }

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) => ({...obj, owner: "666979c6e37d72ba4edb8e9b"}));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
};

initDB();