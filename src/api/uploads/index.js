const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, albumsService, uploadsValidator }) => {
    const uploadsHandler = new UploadsHandler(storageService, albumsService, uploadsValidator);
    server.route(routes(uploadsHandler));
  },
};
