const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: (request, h) => handler.postExportSongsInPlaylistHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
