const express = require("express");
const Transaction=require('../models/Transaction')
const bcrypt = require("bcryptjs");

const transactionController={
    createTransaction: async (req, res, next) => {
        try {
            console.log(req.body);
            const { cost, category, note,time,transaction_type } = req.body;
           
            if (!cost || !category || !note || !time || !transaction_type) {
                console.log('Transaction created false!, Invalid data provided')
                return res.status(401).json({
                    success: false,
                    message: "Transaction created false!, Invalid data provided",
                });
            }
            
            const costNumber = parseFloat(cost);
            const parsedTime = new Date(time);
          
        
            const newTransaction = new Transaction({
                cost: costNumber,
                category,
                note,
                time:parsedTime,
                transaction_type
            });

            await newTransaction.save();

           return res.status(201).json({
                success: true,
                message: "Transaction created successfully!",
                transaction: newTransaction
            });
        }catch(error){
          
            console.error('Error',error);
           next(error);
            /*res.status(500).json({
                success: false,
                message: "Internal server error",
            });*/
        }
    },
    getAllTransaction: async (req, res, next) => {
        try {
            const transactions = await Transaction.find({});
            res.status(200).json(transactions);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
    
}
module.exports= transactionController;