const Product = require('../models/Product');
const Category = require('../models/Category');
const Shop = require('../models/Shop');
const cloudinary = require("cloudinary").v2;

const productController = {

    searchProducts: async (req, res, next) => {
        try {
            const { categoryId, name } = req.body;

            let filter = {};
            if (categoryId) {
                filter.categoryId = categoryId;
            }
            if (name) {
                filter.name = { $regex: new RegExp(name, 'i') }; // Tìm kiếm không phân biệt hoa thường
            }

            const products = await Product.find(filter).populate('categoryId');

            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },

    getAllProducts: async (req, res, next) => {
        try {
            const products = await Product.find({});
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },
    
    getProductById: async (req, res, next) => {
        try {
            const { id } = req.query;
            const product = await Product.findById(id).populate('categoryId').populate('shopId');
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    },

    getProductsByShopId: async (req, res, next) => {
        try {
            const { shopId } = req.query;
    
            const shop = await Shop.findOne({ _id: shopId });
            if (!shop) {
                return res.status(404).json({ message: "Shop không tồn tại." });
            }
    
            const products = await Product.find({ shopId: shopId });
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },

    getProductsByCategoryId: async (req, res, next) => {
        try {
            const { categoryId } = req.query;
    
            const category = await Category.findOne({ _id: categoryId });
            if (!category) {
                return res.status(404).json({ message: "Category không tồn tại." });
            }
    
            const products = await Product.find({ categoryId: categoryId });
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    },
    

    createProduct: async (req, res, next) => {
        try {
            const { name, description, originalPrice, discountPrice, categoryId, shopId, images, quantityInStock } = req.body;
    
            const category = await Category.findOne({ _id: categoryId });
            if (!category) {
                return res.status(400).json({ message: "categoryId không tồn tại trong cơ sở dữ liệu." });
            }
    
            const shop = await Shop.findOne({ _id: shopId });
            if (!shop) {
                return res.status(400).json({ message: "shopId không tồn tại trong cơ sở dữ liệu." });
            }
    
            const existingProduct = await Product.findOne({ name });
            if (existingProduct) {
                return res.status(400).json({ message: "Tên sản phẩm đã tồn tại." });
            }
    
            let imageLinks = [];
    
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: "products",
                });
                imageLinks.push({
                    public_id: result.public_id,
                    url: result.secure_url,
                });
            }
    
            const newProduct = new Product({
                name,
                description,
                originalPrice,
                discountPrice,
                categoryId,
                shopId,
                images: imageLinks,
                quantityInStock
            });
    
            await newProduct.save();
    
            shop.products.push(newProduct._id);
            await shop.save();
    
            res.status(201).json({
                success: true,
                message: "Product created successfully!",
                product: newProduct
            });
        } catch (error) {
            next(error);
        }
    },
    
    updateProduct: async (req, res, next) => {
        try {
            const { id, name, description, originalPrice, discountPrice, categoryId, shopId, images, quantityInStock } = req.body;
    
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
    
            const existingProduct = await Product.findOne({ name, _id: { $ne: id } });
            if (existingProduct) {
                return res.status(400).json({ message: "Tên sản phẩm đã tồn tại." });
            }
    
            if (categoryId) {
                const category = await Category.findOne({ _id: categoryId });
                if (!category) {
                    return res.status(400).json({ message: "categoryId không tồn tại trong cơ sở dữ liệu." });
                }
                product.categoryId = categoryId;
            }
    
            if (shopId) {
                const shop = await Shop.findOne({ _id: shopId });
                if (!shop) {
                    return res.status(400).json({ message: "shopId không tồn tại trong cơ sở dữ liệu." });
                }
                product.shopId = shopId;
            }
    
            if (images && images.length > 0) {
                for (let i = 0; i < product.images.length; i++) {
                    await cloudinary.uploader.destroy(product.images[i].public_id);
                }
    
                let imageLinks = [];
                if (typeof images === "string") {
                    images = [images];
                }
        
                for (let i = 0; i < images.length; i++) {
                    const result = await cloudinary.uploader.upload(images[i], {
                        folder: "products",
                    });
                    imageLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url,
                    });
                }
                product.images = imageLinks;
            }
    
            if (name) product.name = name;
            if (description) product.description = description;
            if (originalPrice) product.originalPrice = originalPrice;
            if (discountPrice) product.discountPrice = discountPrice;
            if (typeof quantityInStock !== 'undefined') product.quantityInStock = quantityInStock;
    
            await product.save();
            
            res.status(200).json({
                success: true,
                message: "Product updated successfully!",
                product: product
            });
    
        } catch (error) {
            next(error);
        }
    },
    

    deleteProduct: async (req, res, next) => {
        try {
            const id = req.query.id || req.params.id;
    
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Sản phẩm không tồn tại." });
            }
    
            for (let i = 0; i < product.images.length; i++) {
                const result = await cloudinary.uploader.destroy(product.images[i].public_id);
            }
    
            await Product.findByIdAndDelete(id);
    
            const shop = await Shop.findById(product.shopId);
            if (shop) {
                shop.products.pull(product._id);
                await shop.save();
            }
    
            res.status(200).json({
                success: true,
                message: "Sản phẩm đã được xóa thành công!"
            });
    
        } catch (error) {
            next(error);
        }
    },
   


};

module.exports = productController;