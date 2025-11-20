const axios = require('axios');
const pool = require('../config/db');

const PRODUCT_SERVICE_BASE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service';

async function fetchProduct(productId) {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_BASE_URL}/products/${productId}`);
    return response.data;
  } catch (error) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || 'Unable to fetch product information from product-service';
    const err = new Error(message);
    err.status = status;
    throw err;
  }
}

exports.createOrder = async (req, res) => {
  const { product_id, quantity } = req.body || {};
  if (!product_id || !quantity || Number(quantity) <= 0) {
    return res.status(400).json({ message: 'product_id and quantity are required and must be valid' });
  }

  try {
    const product = await fetchProduct(product_id);
    if (!product?.price || !product?.stock) {
      return res.status(502).json({ message: 'Product service returned incomplete data' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock for this product' });
    }

    const totalPrice = Number(product.price) * Number(quantity);
    const [result] = await pool.execute(
      'INSERT INTO orders (user_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, product_id, quantity, totalPrice.toFixed(2), 'pending']
    );

    const [createdOrderRows] = await pool.execute('SELECT * FROM orders WHERE id = ?', [result.insertId]);
    return res.status(201).json(createdOrderRows[0]);
  } catch (error) {
    console.error('Create order error:', error.message);
    const status = error.status || 500;
    return res.status(status).json({ message: error.message || 'Failed to create order' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    return res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);

    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(orders[0]);
  } catch (error) {
    console.error('Get order error:', error.message);
    return res.status(500).json({ message: 'Failed to fetch order' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [
      req.params.id,
      req.user.id,
    ]);

    if (!orders.length) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = orders[0];
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending orders can be cancelled' });
    }

    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', order.id]);
    order.status = 'cancelled';
    return res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error.message);
    return res.status(500).json({ message: 'Failed to cancel order' });
  }
};
