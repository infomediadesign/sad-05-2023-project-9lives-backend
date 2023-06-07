//===================IMPORTS=======================//
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const db = require("./db");

//===================CONFIGS=======================//
dotenv.config();
//===================DB=======================//
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("DB Connection is succssfull"))
//   .catch((err) => {
//     console.log(err);
//   });

//===================SERVER=======================//
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Backend server is up and running!");
  db.createConnections(process.env.MONGO_URI);
});
