const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// POST /api/teacher-inquiry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ msg: 'Missing fields' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Teacher inquiry: ${subject || '(no subject)'} - ${name}`,
      text: `From: ${name} <${email}>\nPhone: ${phone || '-'}\n\n${message}`,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Teacher inquiry error:', err);
    res.status(500).json({ msg: 'Failed to send request' });
  }
});

module.exports = router;
