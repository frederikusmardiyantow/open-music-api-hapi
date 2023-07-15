const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistsService, usersService }) => {
    // eslint-disable-next-line max-len
    const collaborationsService = new CollaborationsHandler(service, playlistsService, usersService);
    server.route(routes(collaborationsService));
  },
};
