const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const SALT_ROUNDS = 10;

const toUserDto = (userDoc) => ({
  id: userDoc._id.toString(),
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  createdAt: userDoc.createdAt,
});

const generateToken = (userDoc) =>
  jwt.sign(
    {
      sub: userDoc._id.toString(),
      role: userDoc.role,
      email: userDoc.email,
      name: userDoc.name,
    },
    env.jwtSecret,
    { expiresIn: '7d' },
  );

const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });
  const token = generateToken(user);
  return { user: toUserDto(user), token };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user);
  return { user: toUserDto(user), token };
};

module.exports = {
  registerUser,
  loginUser,
  toUserDto,
};
