const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// CORS configuration (configurable via env)
const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://alilm.site',
  'https://www.alilm.site'
]).map(o => o.trim());

const corsOptions = {
  origin: function (origin, callback) {
    // Allow all origins for now to ensure smooth deployment
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token', 'range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

// Serve uploads as static files with proper CORS
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1h',
  etag: false,
  setHeaders: (res, filePath) => {
    // Set PDF-specific headers
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
    }
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
}));

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/academy';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Debug endpoint to check uploads directory
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

// Diagnostic endpoint for PDF and CORS testing
app.get('/api/health', cors(corsOptions), (req, res) => {
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uploadDir: path.join(__dirname, 'uploads'),
    allowedOrigins: ALLOWED_ORIGINS,
    timestamp: new Date().toISOString(),
  });
});

const noteRoute = require('./routes/notes');
app.use('/api/notes', noteRoute);

const uploadRouter = require('./routes/Upload');
app.use('/api/upload', uploadRouter);

// Auth and Users routes (admin-only login and current user info)
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Contact and Teacher Inquiry endpoints
const contactRouter = require('./routes/contact');
app.use('/api/contact', contactRouter);

const teacherInquiryRouter = require('./routes/teacherInquiry');
app.use('/api/teacher-inquiry', teacherInquiryRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});