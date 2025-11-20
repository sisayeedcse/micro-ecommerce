const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables before other imports rely on them.
dotenv.config();

// Initialize database connection (also ensures table creation).
require('./config/db');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'user-service is running' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`user-service listening on port ${PORT}`);
});
