const Joi = require('joi');

const BridgesPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = BridgesPayloadSchema;
