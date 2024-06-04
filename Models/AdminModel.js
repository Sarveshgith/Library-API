const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({

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
    }
},
{
    timestamps : true,
});

const Admins = mongoose.model("Admin", AdminSchema);
module.exports = Admins;