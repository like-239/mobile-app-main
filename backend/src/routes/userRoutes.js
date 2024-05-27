const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { checkAdminRole } = require('../middlewares/authorization');

router.post("/create", userController.createUser);

//router.post("/", checkAdminRole, userController.updateUser);

router.get("/details",checkAdminRole, userController.getUserById);

router.get("/",checkAdminRole, userController.getAllUser);

router.delete("/delete", checkAdminRole, userController.deleteUser);

router.post('/addRecentlyViewed', userController.addRecentlyViewedProduct);

router.get('/recentlyViewed/list', userController.getRecentlyViewedProducts);

module.exports = router;