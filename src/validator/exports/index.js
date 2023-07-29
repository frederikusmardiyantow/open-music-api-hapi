const InvariantError = require('../../exceptions/InvariantError');
const ExportsPayloadSchema = require('./schema');

const ExportValidator = {
  validateExportSongsInPlaylistPayload: (payload) => {
    const validateResult = ExportsPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = ExportValidator;
