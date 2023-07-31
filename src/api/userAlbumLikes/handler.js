class UserAlbumLikesHandler {
  constructor(service, albumService) {
    this._service = service;
    this._albumService = albumService;
  }

  async postUserAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._albumService.getAlbumById(albumId);
    await this._service.cekUserLike(userId, albumId);
    await this._service.postLike(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil Menyukai Album',
    });
    response.code(201);
    return response;
  }

  async getUserAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    const result = await this._service.getLikesbyAlbum(albumId);
    
    const likes = result.rowCount;

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });
    if (result.cache) {
      response.header('X-Data-Source', 'cache');
    }
    response.code(200);
    return response;
  }

  async deleteUserAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;

    await this._service.deleteUserLikebyAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil Batal Menyukai Album',
    });
    response.code(200);
    return response;
  }
}

module.exports = UserAlbumLikesHandler;
