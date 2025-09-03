const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  // ...signup logic...
  res.json({ message: 'Signup endpoint' });
};

exports.signin = async (req, res) => {
  // ...signin logic...
  res.json({ message: 'Signin endpoint' });
};
