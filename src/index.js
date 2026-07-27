require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const initDB = require('./config/initDB');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

// Health check / UI entry route
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.sendFile(path.join(__dirname, '../public/index.html'));
  }
  res.json({
    message: '🚀 Product API is running!',
    version: '1.0.0',
    database_mode: pool.isMock() ? 'memory' : 'postgresql',
    endpoints: {
      'GET    /api/products':     'Get all products',
      'GET    /api/products/:id': 'Get product by ID',
      'POST   /api/products':     'Create a new product',
      'PUT    /api/products/:id': 'Update a product',
      'DELETE /api/products/:id': 'Delete a product',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: pool.isMock() ? 'memory' : 'postgresql',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/products', productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  // Gracefully catch malformed JSON payloads from Postman or client apps
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('❌ Lỗi cú pháp JSON trong yêu cầu gửi lên:', err.message);
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON payload',
      message: 'Cú pháp JSON bạn gửi trong phần Body bị lỗi. Hãy kiểm tra lại xem có bị quên dấu phẩy (,), thừa dấu phẩy ở dòng cuối, hoặc mở đóng ngoặc sai không.',
      details: err.message
    });
  }
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database (create table if not exists)
    await initDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📖 API Docs: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
