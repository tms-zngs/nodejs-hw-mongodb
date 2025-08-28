import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

const datePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{6}$/;

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least {#limit} characters long',
    'string.max': 'Name must be less than or equal to {#limit} characters long',
    'any.required': 'Name field is required',
  }),
  phoneNumber: Joi.string()
    .required()
    .pattern(/^\+?[0-9\s\-()]+$/)
    .messages({
      'string.empty': 'Phone number is required',
      'string.pattern.base':
        'Invalid phone number format. Allowed characters: digits, spaces, "+", "-", parentheses.',
      'any.required': 'Phone number field is required',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .optional()
    .messages({ 'string.email': 'Invalid email format' }),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal')
    .required()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal',
      'any.required': 'Contact type field is required',
    }),
  createdAt: Joi.string().pattern(datePattern).optional().messages({
    'string.pattern.base': 'Date must be in format YYYY-MM-DDTHH:mm:ss.SSSSSS',
  }),
  userId: Joi.string().custom((value, helper) => {
    const isValidId = isValidObjectId(value);

    if (!isValidId) {
      return helper.message('Not valid userId');
    }

    return value;
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.min': 'Name must be at least {#limit} characters long',
    'string.max': 'Name must be less than or equal to {#limit} characters long',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9\s\-()]+$/)
    .messages({
      'string.pattern.base':
        'Invalid phone number format. Allowed characters: digits, spaces, "+", "-", parentheses.',
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Invalid email format',
    }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'any.only': 'Contact type must be one of: work, home, personal',
  }),
  createdAt: Joi.string().pattern(datePattern).optional().messages({
    'string.pattern.base': 'Date must be in format YYYY-MM-DDTHH:mm:ss.SSSSSS',
  }),
}).min(1);
