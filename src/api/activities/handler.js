class ActivitiesHandler {
  constructor(activitiesService, playlistsService) {
    this._activitiesService = activitiesService;
    this._playlistsService = playlistsService;
  }

  async getActivities(request, h) {
    const playlistId = Object.values(request.params)[0];
    const { id: credentialId } = request.auth.credentials;
    
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistsService.getPlaylistById(playlistId);

    const activities = await this._activitiesService.getActivities(playlistId);
    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ActivitiesHandler;
