const express = require("express");
const { AddBook, DelBook } = require("../Controllers/BookController");
const router = express.Router();

//router.use(ValidToken);
router.post("/add", AddBook);
router.delete("/remove", DelBook);

module.exports = router;

