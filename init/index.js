const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../module/listing.js");

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/major1");
}

const initDB = async () => {
  await Listing.insertMany(initData.data);
};

initDB();
