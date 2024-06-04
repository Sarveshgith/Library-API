const mongoose = require("mongoose");

const BookSchema = mongoose.Schema({
    title : {
        type : String, 
        required : true,
    },

    author : {
        type : String,
        required : true,
    },

    available : {
        type : Boolean,
        default : true
    },

    returnDate : {
        type : Date,
    },

    borrowedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Student',
    },
},
{
    timestamps : true,
});

const Books = mongoose.model("Book", BookSchema);
module.exports = Books;