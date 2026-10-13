const { Pool } = require('pg');

// Support both DATABASE_URL connection string and separate DB variables
// Auto-enable SSL for cloud databases like Neon.tech or Supabase
const isCloudDB = process.env.DATABASE_URL || process.env.DB_SSL === 'true';

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000 // 15s timeout for cloud DB cold starts (e.g., Neon serverless)
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres123',
      database: process.env.DB_NAME || 'product_db',
      ssl: isCloudDB ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 15000
    };

let pgPool = new Pool(poolConfig);

let isMock = false;

// Mock database storage
const mockDB = {
  products: [
    {
      id: 1,
      name: 'Tai nghe không dây Ultra-Wireless',
      description: 'Tai nghe chụp tai không dây chống ồn với thời lượng pin lên đến 40 giờ.',
      price: 199.99,
      quantity: 45,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 2,
      name: 'Vòng tay thông minh Smart Band 7',
      description: 'Thiết bị theo dõi sức khỏe chống nước với các tính năng đo nhịp tim và phân tích giấc ngủ.',
      price: 49.99,
      quantity: 120,
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 3,
      name: 'Bàn phím cơ Gaming Mechanical',
      description: 'Bàn phím cơ có đèn nền RGB, sử dụng switch Blue mang lại cảm giác gõ cực đã.',
      price: 89.99,
      quantity: 30,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  nextId: 4
};

const handleMockQuery = async (text, params) => {
  const queryText = text.trim().replace(/\s+/g, ' ');
  
  if (queryText.includes('CREATE TABLE')) {
    return { rows: [] };
  }
  
  if (queryText.includes('SELECT * FROM products ORDER BY')) {
    return { rows: [...mockDB.products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) };
  }
  
  if (queryText.includes('SELECT * FROM products WHERE id =')) {
    const id = parseInt(params[0]);
    const product = mockDB.products.find(p => p.id === id);
    return { rows: product ? [product] : [] };
  }
  
  if (queryText.includes('INSERT INTO products')) {
    const [name, description, price, quantity] = params;
    const newProduct = {
      id: mockDB.nextId++,
      name,
      description: description || '',
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockDB.products.push(newProduct);
    return { rows: [newProduct] };
  }
  
  if (queryText.includes('UPDATE products')) {
    const [name, description, price, quantity, id] = params;
    const targetId = parseInt(id);
    const index = mockDB.products.findIndex(p => p.id === targetId);
    if (index === -1) {
      return { rows: [] };
    }
    
    const existing = mockDB.products[index];
    const updatedProduct = {
      ...existing,
      name: name !== null && name !== undefined ? name : existing.name,
      description: description !== null && description !== undefined ? description : existing.description,
      price: price !== null && price !== undefined ? parseFloat(price) : existing.price,
      quantity: quantity !== null && quantity !== undefined ? parseInt(quantity) : existing.quantity,
      updated_at: new Date().toISOString()
    };
    
    mockDB.products[index] = updatedProduct;
    return { rows: [updatedProduct] };
  }
  
  if (queryText.includes('DELETE FROM products')) {
    const id = parseInt(params[0]);
    const index = mockDB.products.findIndex(p => p.id === id);
    if (index === -1) {
      return { rows: [] };
    }
    const deleted = mockDB.products.splice(index, 1)[0];
    return { rows: [deleted] };
  }
  
  throw new Error(`Unsupported query in mock DB: ${text}`);
};

const pool = {
  isMock: () => isMock,
  query: async (text, params) => {
    if (isMock) {
      return handleMockQuery(text, params);
    }
    try {
      return await pgPool.query(text, params);
    } catch (err) {
      if (
        err.code === 'ECONNREFUSED' ||
        err.message.includes('connect') ||
        err.message.includes('timeout') ||
        err.message.includes('does not exist') ||
        err.message.includes('database')
      ) {
        console.warn(`⚠️ Connection to PostgreSQL database failed (${err.message}). Switching to local in-memory database fallback.`);
        isMock = true;
        return handleMockQuery(text, params);
      }
      throw err;
    }
  },
  on: (event, handler) => {
    try {
      pgPool.on(event, handler);
    } catch (e) {
      console.warn('⚠️ Failed to register DB event listener:', e.message);
    }
  }
};

module.exports = pool;
