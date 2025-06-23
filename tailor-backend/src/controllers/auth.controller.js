const authService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  
  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: { user }
  });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body);
  
  res.json({
    status: 'success',
    message: 'Login successful',
    data: result
  });
});

const getProfile = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  
  res.json({
    status: 'success',
    data: { user }
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const user = await authService.updateUser(req.user._id, req.body);
  
  res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: { user }
  });
});

const deleteProfile = catchAsync(async (req, res) => {
  await authService.deleteUser(req.user._id);
  
  res.json({
    status: 'success',
    message: 'Profile deleted successfully'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile
}; 