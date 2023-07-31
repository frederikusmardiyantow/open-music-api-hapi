const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().max(500).required(),
});

module.exports = PlaylistPayloadSchema;
