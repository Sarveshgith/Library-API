const express = require("express");
const { RegisterUser, LoginUser, GetBooks, GetStudents, UpdateStudent, DelStudent } = require("../Controllers/AdminController");
const router = express.Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);
router.get("/books", GetBooks);
router.get("/student", GetStudents);
router.put("/student/:id", UpdateStudent);
router.delete("/student/:id", DelStudent);

module.exports = router;