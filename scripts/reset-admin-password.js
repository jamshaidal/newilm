
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function resetAdminPassword() {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log('process.env.MONGODB_URI:', process.env.MONGODB_URI);
  console.log('process.env.MONGO_URI:', process.env.MONGO_URI);
  if (!MONGODB_URI) {
    console.error('MongoDB URI not found in .env (MONGODB_URI or MONGO_URI)');
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const cliEmail = process.argv[2];
  const cliPassword = process.argv[3];
  const email = cliEmail || process.env.ADMIN_EMAIL || 'alilmacadmy@gmail.com';
  const password = cliPassword || process.env.ADMIN_PASSWORD || '*Aa786Aa#';
  const hash = await bcrypt.hash(password, 10);
  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name: 'Admin',
      email,
      password: hash,
      role: 'admin',
    });
    await user.save();
    console.log('Admin user created and password set.');
  } else {
    user.password = hash;
    user.role = 'admin';
    await user.save();
    console.log('Admin password updated.');
  }
  await mongoose.disconnect();
  console.log('Done.');
}

resetAdminPassword();
