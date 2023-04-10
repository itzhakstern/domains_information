import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  VIRUS_TOTAL_ENDPOINT: Joi.string().required(),
  WHOIS_ENDPOINT: Joi.string().required(),
  VIRUS_TOTAL_API_KEY: Joi.string().required(),
  WHOIS_API_KEY: Joi.string().required(),
  SECURITY_TRAILS_ENDPOINT: Joi.string().required(),
  SECURITY_TRAILS_API_KEY: Joi.string().required(),
  PERIOD_AGO_TO_SCAN: Joi.string().required(),
});
