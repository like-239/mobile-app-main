const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Product = require("../models/Product");

const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

function isValidEmail(email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

const userController = {
    // create user
    createUser: async (req, res, next) => {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username or email already exists",
                });
            }
            
            if (!isValidEmail(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format, please try again."
                });
            }
           

            const hashedPassword = await bcrypt.hash(password, 12);

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                
            });

            await newUser.save();

            res.status(201).json({
                success: true,
                message: "User created successfully!",
                user: newUser
            });
        } catch (error) {
            console.error('Error',error);
           
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    /*updateUser: async (req, res, next) => {
        try {
            const { id, email, password, ...updates } = req.body;
    
            const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (email && !emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format.",
                });
            }
    
            if (email) {
                const existingUser = await User.findOne({ email: email }).lean();
                if (existingUser && existingUser._id.toString() !== id) {
                    return res.status(400).json({
                        success: false,
                        message: "Email already exists.",
                    });
                }
            }
    
            const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
    
            res.status(200).json({
                success: true,
                message: "User updated successfully!",
                user: updatedUser
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: error.message || "Internal server error",
            });
        }
    },*/
    

    getUserById: async (req, res, next) => {
        try {
            const userId = req.query.id;
            const user = await User.findById(userId);
            console.log('id nguoi dung',userId);
            if (!user) {
               
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    
                });
            }
            
            res.status(200).json({
                success: true,
                user: user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },
    
    getAllUser: async (req, res, next) => {
        try {
            const users = await User.find({});
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const userId = req.query.id;

            console.log(userId)
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            
            await User.findByIdAndRemove(userId);
            
            res.status(200).json({
                success: true,
                message: "User deleted successfully!",
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    },

    addRecentlyViewedProduct: async (req, res, next) => {
        try {
            const userId = req.query.id;
            const { productId } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            // Kiểm tra và loại bỏ sản phẩm cũ nếu quá 5
            if (user.recentlyViewedProducts.length >= 5) {
                user.recentlyViewedProducts.shift();
            }

            user.recentlyViewedProducts.push(productId);
            await user.save();

            res.status(200).json({
                success: true,
                message: "Recently viewed product added successfully",
                data: user.recentlyViewedProducts
            });
        } catch (error) {
            next(error);
        }
    },

    getRecentlyViewedProducts: async (req, res, next) => {
        try {
            const userId = req.query.id;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const productDetails = await Product.find({
                '_id': { $in: user.recentlyViewedProducts }
            });
    
            res.status(200).json({
                success: true,
                recentlyViewedProducts: productDetails
            });
            
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
}

// export
module.exports = userController;