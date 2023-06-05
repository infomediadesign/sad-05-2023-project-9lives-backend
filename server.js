//===================IMPORTS=======================//
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

//===================CONFIGS=======================//
dotenv.config();
//===================DB=======================//
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection is succssfull"))
  .catch((err) => {
    console.log(err);
  });

//===================SERVER=======================//
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Backend server is up and running!");
});
