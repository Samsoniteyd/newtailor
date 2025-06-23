const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const register = async (userData) => {
  const { name, email, phone, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : [])
    ]
  });

  if (existingUser) {
    throw new AppError('User already exists with this email or phone', 400);
  }

  // Create user
  const user = await User.create({ name, email, phone, password });

  // Generate token
  const token = generateToken(user._id);

  return {
    user,
    token
  };
};

const login = async (loginData) => {
  const { email, phone, password } = loginData;

  // Find user by email or phone
  const user = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : [])
    ]
  }).select('+password');

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Update last login
  await user.updateLastLogin();

  // Generate token
  const token = generateToken(user._id);

  // Remove password from response
  user.password = undefined;

  return {
    user,
    token
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updateUser = async (userId, updateData) => {
  const { name, email, phone } = updateData;

  // Check if email or phone is being updated and already exists
  if (email || phone) {
    const existingUser = await User.findOne({
      _id: { $ne: userId },
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      throw new AppError('Email or phone already in use', 400);
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, email, phone },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return { message: 'User deleted successfully' };
};

module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser
}; 