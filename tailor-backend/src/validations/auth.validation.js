const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot be longer than 50 characters',
      'any.required': 'Name is required'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email cannot be empty if provided'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{10,15}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid phone number (10-15 digits)',
      'string.empty': 'Phone number cannot be empty if provided'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
}).or('email', 'phone').messages({
  'object.missing': 'Please provide either an email address or phone number'
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{10,15}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    }),
}).or('email', 'phone').messages({
  'object.missing': 'Please provide either an email address or phone number'
});

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot be longer than 50 characters'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]{10,15}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid phone number (10-15 digits)'
    }),
}).min(1).messages({
  'object.min': 'Please provide at least one field to update'
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema
}; 