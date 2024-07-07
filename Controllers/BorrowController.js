const Borrow = require("../Models/BorrowModel");
const Book = require("../Models/BookModel");
const Student = require("../Models/StudentModel");
const { DateDifference } = require("../utils/DateDiff");
const DefinedError = require("../Middleware/DefinedError");
const { errHandle } = require("../Middleware/errHandle");

const DuePeriod = 14;
const DueAmount = 10; // per day

const BorrowBooks = async (req, res) => {
  try {
    const { regno, bookId } = req.body;

    if (!regno || !bookId) {
      throw new DefinedError(
        400,
        "error",
        "Missing Fields",
        "Book Not Borrowed"
      );
    }

    const book = await Book.findById(bookId);
    const student = await Student.findOne({ regno });

    if (!book) {
      throw new DefinedError(
        404,
        "error",
        "Book Not Found",
        "Book Not Borrowed"
      );
    }

    if (!student) {
      throw new DefinedError(
        404,
        "error",
        "User Not Found",
        "Book Not Borrowed"
      );
    }

    const borrowCount = await Borrow.countDocuments({ bookId: book._id });

    if (borrowCount >= book.quantity) {
      throw new DefinedError(
        401,
        "error",
        "Book Not Available",
        "Book Not Borrowed"
      );
    }

    await Borrow.create({ regno, bookId });
    return res.status(200).send("Book borrowed successfully!");
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "Book Not Borrowed", res);
  }
};

const ReturnBooks = async (req, res) => {
  try {
    const { regno, bookId } = req.body;

    if (!regno || !bookId) {
      throw new DefinedError(
        400,
        "error",
        "Missing Fields",
        "Book Not Returned"
      );
    }

    const borrowedRecord = await Borrow.findOne({ bookId, regno });
    if (!borrowedRecord) {
      throw new DefinedError(
        404,
        "error",
        "You Have Not Borrowed This Book",
        "Book Not Returned"
      );
    }

    const book = await Book.findById(bookId);
    if (!book) {
      throw new DefinedError(
        404,
        "error",
        "Book Not Found",
        "Book Not Returned"
      );
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

    return res.status(200).json({
      message: "Book has been returned",
      DueAmount: due,
      Book_Name: book.title,
      Reg_no: regno,
    });
  } catch (err) {
    errHandle(err, err instanceof DefinedError, "Book Not Returned", res);
  }
};

module.exports = { BorrowBooks, ReturnBooks };
