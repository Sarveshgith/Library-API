const mongoose = require("mongoose");
const Book = require("./BookModel");
const Student = require("./StudentModel");

const BorrowSchema = mongoose.Schema({

    bookId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required : true,
    },

    studentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
        required : true,
    }
});

const Borrow = mongoose.model("Borrow", BorrowSchema);
module.exports = Borrow;