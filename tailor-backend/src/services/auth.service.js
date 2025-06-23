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

  // Check for existing email
  if (email) {
    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      throw new AppError('This email has been used to register before. Please use a different email or try logging in.', 400);
    }
  }

  // Check for existing phone
  if (phone) {
    const existingPhoneUser = await User.findOne({ phone });
    if (existingPhoneUser) {
      throw new AppError('This phone number has been used to register before. Please use a different phone number or try logging in.', 400);
    }
  }

  // Validate that at least email or phone is provided
  if (!email && !phone) {
    throw new AppError('Please provide either an email address or phone number to register.', 400);
  }

  try {
    // Create user
    const user = await User.create({ 
      name, 
      email: email || undefined,
      phone: phone || undefined,
      password 
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      user,
      token
    };
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      throw new AppError(errors.join('. '), 400);
    }
    
    // Handle duplicate key errors (in case of race condition)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      if (field === 'email') {
        throw new AppError('This email has been used to register before. Please use a different email.', 400);
      } else if (field === 'phone') {
        throw new AppError('This phone number has been used to register before. Please use a different phone number.', 400);
      }
    }
    
    throw error;
  }
};

const login = async (loginData) => {
  const { email, phone, password } = loginData;

  // Validate that at least email or phone is provided
  if (!email && !phone) {
    throw new AppError('Please provide either an email address or phone number to login.', 400);
  }

  // Find user by email or phone
  const user = await User.findOne({
    $or: [
      ...(email ? [{ email }] : []),
      ...(phone ? [{ phone }] : [])
    ]
  }).select('+password');

  if (!user) {
    if (email) {
      throw new AppError('No account found with this email address. Please check your email or register for a new account.', 401);
    } else {
      throw new AppError('No account found with this phone number. Please check your phone number or register for a new account.', 401);
    }
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Incorrect password. Please try again.', 401);
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
    throw new AppError('User account not found.', 404);
  }

  return user;
};

const updateUser = async (userId, updateData) => {
  const { name, email, phone } = updateData;

  // Check if email is being updated and already exists
  if (email) {
    const existingEmailUser = await User.findOne({
      _id: { $ne: userId },
      email
    });

    if (existingEmailUser) {
      throw new AppError('This email is already being used by another account. Please choose a different email.', 400);
    }
  }

  // Check if phone is being updated and already exists
  if (phone) {
    const existingPhoneUser = await User.findOne({
      _id: { $ne: userId },
      phone
    });

    if (existingPhoneUser) {
      throw new AppError('This phone number is already being used by another account. Please choose a different phone number.', 400);
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email: email || undefined,
        phone: phone || undefined 
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User account not found.', 404);
    }

    return user;
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      throw new AppError(errors.join('. '), 400);
    }
    throw error;
  }
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  
  if (!user) {
    throw new AppError('User account not found.', 404);
  }

  return { message: 'Account deleted successfully.' };
};

module.exports = {
  register,
  login,
  getUserById,
  updateUser,
  deleteUser
}; 