const pool = require('./db');

const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      quantity INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    if (pool.isMock()) {
      console.log('ℹ️ Database initialized in Local In-Memory mode.');
    } else {
      console.log('✅ Products table is ready (PostgreSQL mode)');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    if (pool.isMock()) {
      console.log('ℹ️ Switched to Local In-Memory fallback mode due to database error.');
      return;
    }
    throw error;
  }
};

module.exports = initDB;
