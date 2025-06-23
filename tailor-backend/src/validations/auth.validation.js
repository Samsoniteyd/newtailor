const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  password: Joi.string().min(6).required(),
}).or('email', 'phone').with('email', 'name').with('phone', 'name');

const loginSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  password: Joi.string().min(6).required(),
}).or('email', 'phone');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
}).min(1);

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
}; 