const Joi = require('joi');

const createRequisitionSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500).allow(''),
  measurements: Joi.object({
    chest: Joi.number().min(0).max(200).allow(null),
    shoulders: Joi.number().min(0).max(100).allow(null),
    sleeveLengthLong: Joi.number().min(0).max(100).allow(null),
    sleeveLengthShort: Joi.number().min(0).max(100).allow(null),
    topLength: Joi.number().min(0).max(200).allow(null),
    neck: Joi.number().min(0).max(50).allow(null),
    tommy: Joi.number().min(0).max(200).allow(null),
    hip: Joi.number().min(0).max(200).allow(null),
    waist: Joi.number().min(0).max(200).allow(null),
    length: Joi.number().min(0).max(200).allow(null),
    lap: Joi.number().min(0).max(200).allow(null),
    base: Joi.number().min(0).max(200).allow(null),
    agbadaLength: Joi.number().min(0).max(200).allow(null),
    agbadaSleeve: Joi.number().min(0).max(100).allow(null),
  }).default({}),
  contactInfo: Joi.object({
    phone: Joi.string().pattern(/^[0-9+\-\s()]{10,15}$/).allow(''),
    email: Joi.string().email().allow(''),
  }).or('phone', 'email').default({}),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  dueDate: Joi.string().isoDate().allow('', null),
});

const updateRequisitionSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  description: Joi.string().max(500).allow(''),
  measurements: Joi.object({
    chest: Joi.number().min(0).max(200).allow(null),
    shoulders: Joi.number().min(0).max(100).allow(null),
    sleeveLengthLong: Joi.number().min(0).max(100).allow(null),
    sleeveLengthShort: Joi.number().min(0).max(100).allow(null),
    topLength: Joi.number().min(0).max(200).allow(null),
    neck: Joi.number().min(0).max(50).allow(null),
    tommy: Joi.number().min(0).max(200).allow(null),
    hip: Joi.number().min(0).max(200).allow(null),
    waist: Joi.number().min(0).max(200).allow(null),
    length: Joi.number().min(0).max(200).allow(null),
    lap: Joi.number().min(0).max(200).allow(null),
    base: Joi.number().min(0).max(200).allow(null),
    agbadaLength: Joi.number().min(0).max(200).allow(null),
    agbadaSleeve: Joi.number().min(0).max(100).allow(null),
  }),
  contactInfo: Joi.object({
    phone: Joi.string().pattern(/^[0-9+\-\s()]{10,15}$/).allow(''),
    email: Joi.string().email().allow(''),
  }),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  dueDate: Joi.string().isoDate().allow('', null),
}).min(1);

module.exports = {
  createRequisitionSchema,
  updateRequisitionSchema
}; 