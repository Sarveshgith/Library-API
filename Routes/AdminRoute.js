const express = require("express");
const { RegisterUser, LoginUser, GetBooks, GetStudents, UpdateStudent, DelStudent } = require("../Controllers/AdminController");
const router = express.Router();
const ValidToken = require("../Middleware/Auth");
const AuthorizeUser = require("../Middleware/Auth");

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/books", ValidToken, AuthorizeUser, GetBooks);
router.get("/student", ValidToken, AuthorizeUser, GetStudents);
router.put("/student/:id", ValidToken, AuthorizeUser, UpdateStudent);
router.delete("/student/:id", ValidToken, AuthorizeUser,DelStudent);

module.exports = router;