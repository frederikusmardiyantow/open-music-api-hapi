const Joi = require('joi');

const SongsPayloadSchema = Joi.object({
  title: Joi.string().max(255).required(),
  year: Joi.number().integer().min(1990).required(),
  genre: Joi.string().max(255).required(),
  performer: Joi.string().max(255).required(),
  duration: Joi.number().integer(),
  albumId: Joi.string(),
});

module.exports = { SongsPayloadSchema };
