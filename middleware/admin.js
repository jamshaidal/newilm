const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    // The `auth` middleware should have already run and attached the user's ID to req.user.id
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin role required.' });
    }

    next();
  } catch (err) {
    console.error('Error in admin middleware:', err.message);
    res.status(500).send('Server error');
  }
};
