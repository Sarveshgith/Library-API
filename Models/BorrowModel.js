const mongoose = require("mongoose");
const Book = require("./BookModel");
const Student = require("./StudentModel");

const BorrowSchema = mongoose.Schema({

    bookId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Book",
        required : true,
    },

    regno : {
        type : Number,
        required : true,
    },

    borrowedAt : {
        type : Date,
        default : Date.now,
    },
},
{
    timestamps : true,
});

const Borrow = mongoose.model("Borrow", BorrowSchema);
module.exports = Borrow;