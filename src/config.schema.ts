import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
});
