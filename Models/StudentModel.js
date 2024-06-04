const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({

    name : {
        type : String,
        required : true
    },

    username : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    created_at : {
        type : Date,
        default : Date.now
    },

    borrowedBooks : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Book',
    },
},
{
    timestamps : true,
});

const Students = mongoose.model("Student", StudentSchema);
module.exports = Students;