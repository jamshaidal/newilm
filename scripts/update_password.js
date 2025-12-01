const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const updatePassword = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI or MONGO_URI is not defined in .env');
        }

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        const email = 'alilmacadmy@gmail.com';

        const user = await User.findOne({ email: email });

        if (!user) {
            console.log('User not found with email:', email);
            const users = await User.find({});
            console.log('Available users:', users.map(u => `${u.name} (${u.email})`));
            process.exit(1);
        }

        console.log(`Found user: ${user.name} (${user.email})`);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Aa786Aa', salt);

        user.password = hashedPassword;
        await user.save();

        console.log('Password updated successfully for user:', user.name);
    } catch (err) {
        console.error('Error updating password:', err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

updatePassword();
