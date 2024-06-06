const AsyncHandler = require("express-async-handler");
const Borrow = require("../Models/BorrowModel");
const Book = require("../Models/BookModel");
const Student = require("../Models/StudentModel");
const {DateDifference} = require("../utils/DateDiff");
const { format } = require("date-fns");
const DuePeriod = 14; 
const DueAmount = 10; //perday
const due = 0;

const BorrowBooks = AsyncHandler(async (req, res) => {
    const { regno, bookId } = req.body;

    if (!regno || !bookId) {
        res.status(400);
        throw new Error("Fields are missing!");
    }

    const book = await Book.findOne({ _id: bookId });
    const student = await Student.findOne({ regno });

    if (!book) {
        res.status(404);
        throw new Error("Book not found");
    }

    if (!student) {
        res.status(404);
        throw new Error("User not registered!");
    }

    const totavail = book.quantity;
    const borrowCount = await Borrow.countDocuments({ bookId: book._id });

    if (borrowCount >= totavail) {
        res.status(400);
        throw new Error("Required book is currently not available");
    }

    await Borrow.create({ regno, bookId });
    res.status(200).send("Book borrowed successfully!");
});

const ReturnBooks = AsyncHandler(async (req, res) => {
    const { regno, bookId } = req.body;

    if (!regno || !bookId) {
        res.status(400).json({ error: "Fields are missing!" });
        return;
    }

    const borrowedRecord = await Borrow.findOne({ bookId, regno });
    if (!borrowedRecord) {
        res.status(404).json({ error: "You have not borrowed this book!" });
        return;
    }

    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404).json({ error: "Book not found" });
        return;
    }

    const borrowedAt = new Date(borrowedRecord.borrowedAt);
    const currentDate = new Date();
    const diff = DateDifference(currentDate, borrowedAt);

    console.log(`It's been ${diff} days since the book was borrowed!`);

    let due = 0;
    if (diff > DuePeriod) {
        due = (diff - DuePeriod) * DueAmount;
    }

    await Borrow.deleteOne({ _id: borrowedRecord._id });

    res.status(200).json({
        message: "Book has been returned",
        DueAmount: due,
        Book_Name: book.title,
        Reg_no: regno
    });
});

module.exports = { BorrowBooks , ReturnBooks};
