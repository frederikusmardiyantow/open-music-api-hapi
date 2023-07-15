class CollaborationsHandler {
  constructor(service, playlistsService, usersService) {
    this._collaborationsService = service;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
  }

  async postCollaboration(request, h) {
    const { playlistId, userId } = request.payload;
    await this._playlistsService.getPlaylistById(playlistId);
    await this._usersService.getUserById(userId);

    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.postCollaboration(playlistId, userId);
    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaboration(request, h) {
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);
    const response = h.response({
      status: 'success',
      message: 'success delete collaboration',
    });
    response.code(200);
    return response;
  }
}

module.exports = CollaborationsHandler;
