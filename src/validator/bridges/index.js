const InvariantError = require('../../exceptions/InvariantError');
const BridgesPayloadSchema = require('./schema');

const BridgeValidator = {
  validateBridgePayload: (payload) => {
    const validateResult = BridgesPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = BridgeValidator;
