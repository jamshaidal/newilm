const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// ------------------------------------------------------
// 🔥 FIXED & CORRECT CORS CONFIG (Render + Express)
// ------------------------------------------------------
const corsOptions = {
  origin: [
    "https://alilm.site",
    "https://www.alilm.site",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token", "range"],
  exposedHeaders: ["Content-Range", "Accept-Ranges"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // 🔥 IMPORTANT FOR PREFLIGHT OPTIONS
// ------------------------------------------------------

// Parse JSON
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1h',
  etag: false,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/academy';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Debug endpoint
app.get('/api/debug/uploads', (req, res) => {
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, 'uploads');
  try {
    const files = fs.readdirSync(uploadsDir);
    res.json({
      uploadsDir,
      exists: fs.existsSync(uploadsDir),
      files,
      count: files.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uploadDir: path.join(__dirname, 'uploads'),
    allowedOrigins: corsOptions.origin,
    timestamp: new Date().toISOString(),
  });
});

// Routes
const noteRoute = require('./routes/notes');
app.use('/api/notes', noteRoute);

const uploadRouter = require('./routes/Upload');
app.use('/api/upload', uploadRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

const teacherInquiryRouter = require('./routes/teacherInquiry');
app.use('/api/teacher-inquiry', teacherInquiryRouter);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
