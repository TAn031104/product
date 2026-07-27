const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// CRUD Routes
router.get('/', getAllProducts);         // GET    /api/products
router.get('/:id', getProductById);     // GET    /api/products/:id
router.post('/', createProduct);        // POST   /api/products
router.put('/:id', updateProduct);      // PUT    /api/products/:id
router.delete('/:id', deleteProduct);   // DELETE /api/products/:id

module.exports = router;
