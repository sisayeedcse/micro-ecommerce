require('dotenv').config();
const express = require('express');
const cors = require('cors');

const orderRoutes = require('./routes/orderRoutes');
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Order service is running' });
});

app.use('/orders', orderRoutes);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});
