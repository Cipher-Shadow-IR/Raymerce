import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { initSocket } from './socket.js';
import startDailyStockRefill, { runStockRefill } from './cronJobs.js';
import { protect, admin } from './middleware/authMiddleware.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'Raymerce API',
    version: '1.0.0',
    status: 'Running',
    documentation: '/api/health'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Raymerce API is running' });
});

app.post('/api/stock/refill', protect, admin, async (req, res) => {
  try {
    const result = await runStockRefill();
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

initSocket(server);
startDailyStockRefill();
