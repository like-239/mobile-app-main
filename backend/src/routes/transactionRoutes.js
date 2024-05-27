const express = require ("express");
const router = express.Router();
const transactionController =require('../controllers/transactionController')
const { checkAdminRole } = require('../middlewares/authorization');
router.get("/",checkAdminRole, transactionController.getAllTransaction);
router.post('/create', checkAdminRole,transactionController.createTransaction);
module.exports = router;
