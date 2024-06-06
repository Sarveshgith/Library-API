const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({

    name : {
        type : String,
        required : true
    },

    regno : {
        type : Number,
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
},
{
    timestamps : true,
});

const Students = mongoose.model("Student", StudentSchema);
module.exports = Students;