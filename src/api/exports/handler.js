class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postExportSongsInPlaylistHandler(request, h) {
    this._validator.validateExportSongsInPlaylistPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };

    await this._service.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'succes',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(200);
    return response;
  }
}

module.exports = ExportsHandler;
