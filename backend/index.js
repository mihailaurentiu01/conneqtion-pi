require('dotenv').config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
app.use(express.json());
mongoose.connect(url).then(value => {
    console.log("Connected successfully");
}).catch(error => {
    console.log(error)
})


app.use("/v1/auth", authRoutes);

app.listen(3000);