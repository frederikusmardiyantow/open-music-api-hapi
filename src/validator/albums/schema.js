const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
  year: Joi.number().integer().min(1900).required(),
});

module.exports = { AlbumPayloadSchema };
