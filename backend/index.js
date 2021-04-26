require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

// Accept json body
app.use(express.json());

// ----ROUTES----
app.use("/v1/auth", authRoutes);
app.use("/v1/user", dashboardRoutes);

// Errors Handler
app.use((error, req, res, next) => {
    const statusCode = error.httpStatusCode || 500;
    const message = error.message;

    return res.status(statusCode).json({message: message})
})

mongoose.connect(process.env.MONGODB_URI).then(value => {
    app.listen(3000);
}).catch(error => {
    console.log(error)
})
