// server.js - Full working version with nurseries & offers
import express from 'express';
import cors from 'cors';
import { db } from './firebase.js';

const app = express();

// ✅ CORS: Fix trailing spaces in allowedOrigins
const allowedOrigins = [
  'https://react-firebase-plant-nursery.vercel.app', // ✅ No trailing spaces
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json({ limit: '10mb' }));

// ✅ GET all nurseries
app.get('/api/nurseries', async (req, res) => {
  try {
    const snapshot = await db.collection('nurseries').get();
    const list = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.published !== false) {
        list.push({ id: doc.id, ...data });
      }
    });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'فشل تحميل المشاتل' });
  }
});

// ✅ GET all offers
app.get('/api/offers', async (req, res) => {
  const today = new Date();
  try {
    const snapshot = await db.collection('offers').get();
    const list = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.published === false) return;

      // If no end date → active
      if (!data.endDate) {
        list.push({ id: doc.id, ...data });
        return;
      }

      // Parse end date
      const endDate = new Date(data.endDate);
      if (isNaN(endDate.getTime())) {
        console.warn(`Invalid endDate for offer ${doc.id}:`, data.endDate);
        return;
      }

      // Check if not expired
      if (endDate >= today) {
        list.push({ id: doc.id, ...data });
      }
    });

    res.json(list);
  } catch (err) {
    console.error('Error fetching offers:', err);
    res.status(500).json({ message: 'فشل تحميل العروض' });
  }
});

// ✅ GET all published categories
app.get('/api/categories', async (req, res) => {
  try {
    const snapshot = await db.collection('categories').get();
    const list = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.published !== false) {
        list.push({
          id: doc.id,
          ...data
        });
      }
    });

    // Sort by order
    list.sort((a, b) => a.order - b.order);

    res.json(list);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'فشل تحميل التصنيفات' });
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ message: 'Nursery API is running 🌿' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});