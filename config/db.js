const mongoose = require("mongoose");
require("dotenv").config();

console.log("URL_DB", process.env.URL_DB);

const DB = async () => {
  try {
    await mongoose.connect(process.env.URL_DB);
  } catch (e) {
    console.log(e);
  }
};
module.exports = DB;
