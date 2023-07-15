const BridgesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'bridges',
  version: '1.0.0',
  register: async (server, {
    bridgesService, playlistsService, validator, activitiesService, 
  }) => {
    // eslint-disable-next-line max-len
    const bridgesHandler = new BridgesHandler(bridgesService, playlistsService, validator, activitiesService);
    server.route(routes(bridgesHandler));
  },
};
