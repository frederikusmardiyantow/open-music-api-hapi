class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const songId = await this._service.addSong(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request, h) {
    const { title, performer } = request.query;
    let songs;
    if (title != null && performer != null) {
      songs = await this._service.getSongByTitleAndPerformer(title, performer);
    } else if (title != null || performer != null) {
      songs = await this._service.getSongByTitleOrPerformer(title, performer);
    } else {
      songs = await this._service.getSongs();
    }
    console.log('masuk 3');
    const response = h.response({
      status: 'success',
      data: {
        songs,
      },
    });
    response.code(200);
    return response;
  }

  async getSongByIdHandler(request, h) {
    const { id } = request.params;

    const song = await this._service.getSongById(id);

    const response = h.response({
      status: 'success',
      data: {
        song,
      },
    });
    response.code(200);
    return response;
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    
    await this._service.editSongById(id, request.payload);
    const response = h.response({
      status: 'success',
      message: 'Berhasil edit data lagu',
    });
    response.code(200);
    return response;
  }

  async deleteSongByIdHandler(request, h) {
    const { id } = request.params;

    await this._service.deleteSongById(id);
    const response = h.response({
      status: 'success',
      message: 'Berhasil hapus lagu',
    });
    response.code(200);
    return response;
  }
}

module.exports = SongsHandler;
