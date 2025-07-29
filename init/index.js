const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/major1");
}

const initDB = async () => {
  await Listing.deleteMany({}); // Clear existing listings
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6877846d0d4c0f4889602b33",
  }));
  await Listing.insertMany(initData.data);
};

initDB();
