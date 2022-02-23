import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.string().required(),
});
