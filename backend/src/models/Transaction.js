const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const transactionSchema = new mongoose.Schema({
    cost: {
        type: Number,
        required: [true, "Please enter transaction'cost!"],
    },
    category: {
        type: String,
        required: [true, "Please enter transaction'category!"],   
    },
    
    note: {
        type: String,
        required: [true, "Please enter transaction'category!"],
        
    },
    time:{
        type: Date,
        required: [true, "Please enter transaction'time!"],
        
    },
   
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    transaction_type:{
        type:String,
        required: [true, "Please enter transaction'type!"],
    }
});

transactionSchema.pre('save', function(next) {
    if (!(this.time instanceof Date)) {
        return next(new Error("Time must be a Date object"));
    }
    
    next();
});


transactionSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id, roleId: this.roleId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};


const Transaction= mongoose.model("Transaction", transactionSchema);
module.exports =Transaction;
