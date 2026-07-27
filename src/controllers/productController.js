const pool = require('../config/db');

// GET /api/products - Get all products
const getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/products/:id - Get single product
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error fetching product:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/products - Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    // Validation
    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name and price are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO products (name, description, price, quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description || '', parseFloat(price), parseInt(quantity) || 0]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/products/:id - Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    // Check if product exists
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           quantity = COALESCE($4, quantity),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [name, description, price !== undefined ? parseFloat(price) : null, quantity !== undefined ? parseInt(quantity) : null, id]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/products/:id - Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    res.json({
      success: true,
      message: `Product with id ${id} deleted successfully`,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
