const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { checkAdminRole } = require('../middlewares/authorization');

router.get('/all',  productController.getAllProducts);
router.get('/', productController.getProductById);
router.post('/create', checkAdminRole, productController.createProduct);
router.get('/byShop', checkAdminRole, productController.getProductsByShopId);
router.get('/byCategory', productController.getProductsByCategoryId);
router.post('/update', checkAdminRole, productController.updateProduct);
router.post('/delete', checkAdminRole, productController.deleteProduct);
router.post('/search', productController.searchProducts);

module.exports = router;