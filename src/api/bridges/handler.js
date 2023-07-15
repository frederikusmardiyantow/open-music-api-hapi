class BridgesHandler {
  constructor(bridgesServise, playlistsService, validator, activitiesService) {
    this._bridgesService = bridgesServise;
    this._playlistsService = playlistsService;
    this._validator = validator;
    this._activitiesService = activitiesService;
  }

  async postSongToPlaylistHandler(request, h) {
    this._validator.validateBridgePayload(request.payload);
    const playlistId = Object.values(request.params)[0];
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;
    
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._bridgesService.postSongToPlaylistBySongId(songId, playlistId);
    await this._activitiesService.postActivity(playlistId, credentialId, songId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Success add Song to Playlist..',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistHandler(request, h) {
    const playlistId = Object.values(request.params)[0];
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const playlist = await this._bridgesService.getSongsInPlaylist(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });
    response.code(200);
    return response;
  }

  async deleteSongFromPlaylistHandler(request, h) {
    this._validator.validateBridgePayload(request.payload);
    const playlistId = Object.values(request.params)[0];
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._activitiesService.postActivity(playlistId, credentialId, songId, 'delete');
    await this._bridgesService.deleteSongFromPlaylistBySongId(songId, playlistId);
    
    const response = h.response({
      status: 'success',
      message: 'success delete song from playlist',
    });
    response.code(200);
    return response;
  }
}

module.exports = BridgesHandler;
