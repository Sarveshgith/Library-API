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

    quantity : {
        type : Number,
        required : true,
    }
},
{
    timestamps : true,
});

const Books = mongoose.model("Book", BookSchema);
module.exports = Books;