const Joi = require('joi');

const AuthenticationsPayloadSchemaPost = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const AuthenticationsPayloadSchemaPutDelete = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { AuthenticationsPayloadSchemaPost, AuthenticationsPayloadSchemaPutDelete };
