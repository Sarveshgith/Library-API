const express = require("express");
const { RegisterUser, LoginUser, GetBooks, GetBook } = require("../Controllers/StudentController");
const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/books", GetBooks);
router.get("/books/search", GetBook);

module.exports = router;