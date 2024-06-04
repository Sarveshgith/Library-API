const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const dbConnect = require("./Config/dbConnect");
const ErrorHandler = require("./Middleware/ErrorHandle");

const port = process.env.PORT || 5000;

const app = express();
dbConnect();
app.use(express.json());
app.use("/api/student", require("./Routes/StudentRoute"));
app.use("/api/admin", require("./Routes/AdminRoute"));
app.use("/api/books", require("./Routes/BookRoute"));
app.use(ErrorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})