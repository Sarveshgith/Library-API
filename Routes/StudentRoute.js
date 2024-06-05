const express = require("express");
const { RegisterUser, LoginUser, GetBooks, GetBook } = require("../Controllers/StudentController");
const router = express.Router();
const ValidToken = require("../Middleware/Auth");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/books", ValidToken, GetBooks);
router.get("/books/search", ValidToken, GetBook);
//api/student/books/search?author=Colleen%20Hoover
module.exports = router;