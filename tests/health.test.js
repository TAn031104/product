const test = require('node:test');
const assert = require('node:assert');

test('Unit Test 1: Kiểm tra phép toán cơ bản của môi trường Node', () => {
  assert.strictEqual(1 + 1, 2);
});

test('Unit Test 2: Kiểm tra cấu hình cấu trúc thư mục API', () => {
  const productRoutes = require('../src/routes/productRoutes');
  assert.ok(productRoutes, 'productRoutes phải được export hợp lệ');
});

test('Unit Test 3: Kiểm tra mock database dự phòng', () => {
  const pool = require('../src/config/db');
  assert.ok(typeof pool.query === 'function', 'Database pool phải có hàm query');
});