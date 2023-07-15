const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getActivities(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
