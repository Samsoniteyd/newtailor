const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
  // Only allow admin users to fetch all users
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Admin rights required.'
    });
  }

  const users = await userService.getAllUsers(req.query);
  
  res.json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  
  res.json({
    status: 'success',
    data: { user }
  });
});

const updateUser = catchAsync(async (req, res) => {
  // Users can only update their own profile, unless they're admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. You can only update your own profile.'
    });
  }

  const user = await userService.updateUser(req.params.id, req.body);
  
  res.json({
    status: 'success',
    message: 'User updated successfully',
    data: { user }
  });
});

const deleteUser = catchAsync(async (req, res) => {
  // Users can only delete their own profile, unless they're admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. You can only delete your own profile.'
    });
  }

  await userService.deleteUser(req.params.id);
  
  res.json({
    status: 'success',
    message: 'User deleted successfully'
  });
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
}; 