class UploadsHandler {
  constructor(storageService, albumsService, uploadsValidator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._uploadsValidator = uploadsValidator;
  }

  async postUploadImageHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;

    this._uploadsValidator.validateImageHeader(cover.hapi.headers);
    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/albums/${id}/covers/${filename}`;

    await this._albumsService.addEditCoverAlbum(id, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
