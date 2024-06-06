const express = require("express");
const { BorrowBooks, ReturnBooks } = require("../Controllers/BorrowController");
const router = express.Router();
const ValidToken = require("../Middleware/Auth");

router.post("/borrow", ValidToken, BorrowBooks);
router.delete("/return", ValidToken, ReturnBooks);

module.exports = router;

