const User = require('../models/user.model');
const AppError = require('../utils/appError');

const getAllUsers = async (queryParams) => {
  const { page = 1, limit = 10, sort = '-createdAt', role, isActive } = queryParams;

  // Build filter
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  // Execute query
  const users = await User.find(filter)
    .sort(sort)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  return users;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updateUser = async (userId, updateData) => {
  const { name, email, phone, role, isActive } = updateData;

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
    { name, email, phone, role, isActive },
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
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
}; 