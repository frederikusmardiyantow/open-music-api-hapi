const InvariantError = require('../../exceptions/InvariantError');
const { AuthenticationsPayloadSchemaPost, AuthenticationsPayloadSchemaPutDelete } = require('./schema');

const AuthenticationValidator = {
  validateAuthenticationPayloadPost: (payload) => {
    const payloadResult = AuthenticationsPayloadSchemaPost.validate(payload);
    if (payloadResult.error) {
      throw new InvariantError(payloadResult.error.message);
    }
  },
  validateAuthenticationPayloadPutDelete: (payload) => {
    const payloadResult = AuthenticationsPayloadSchemaPutDelete.validate(payload);
    if (payloadResult.error) {
      throw new InvariantError(payloadResult.error.message);
    }
  },
};

module.exports = AuthenticationValidator;
