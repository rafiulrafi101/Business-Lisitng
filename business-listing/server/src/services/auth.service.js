const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const TOKEN_EXPIRY = '7d';

const generateToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: TOKEN_EXPIRY },
  );

const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const user = userDoc.toJSON();
  return user;
};

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.badRequest('Email already registered');
  }

  const passwordHash = await User.hashPassword(password);
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const token = generateToken(user);
  return {
    user: sanitizeUser(user),
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const plainUser = await User.findById(user.id);
  const token = generateToken(plainUser);

  return {
    user: sanitizeUser(plainUser),
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
