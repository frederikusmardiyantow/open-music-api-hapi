const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.postUserAlbumLikeHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.getUserAlbumLikesHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: (request, h) => handler.deleteUserAlbumLikeHandler(request, h),
    options: {
      auth: 'playlist_jwt',
    },
  },
];

module.exports = routes;
