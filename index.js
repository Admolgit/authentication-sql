const express = require("express");
const helmet = require("helmet")
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
// const multer = require("multer");
const bodyParser = require("body-parser");
const configDb = require("./src/db");

const app = express();

const user = require("./src/Routes/user");
const product = require("./src/Routes/product");

app.use(helmet())
app.use(morgan('dev'));
app.use(express.json({ limit: "900mb" }));
app.use(express.urlencoded({ extended: true, limit: "900mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "900mb" }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", user);
app.use("/", product)

app.get("/createdb", (req, res) => {
  console.log("createdb");
  let sql = "CREATE DATABASE Authentications";
  configDb.query(sql, (err, result) => {
    if (err) console.log(err, "ERROR");
    console.log(result, "RESULT");
    res.send("Database create");
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
