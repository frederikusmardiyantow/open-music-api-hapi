require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');
const ClientError = require('./exceptions/ClientError');

const albums = require('./api/albums');
const AlbumsService = require('./services/AlbumsService');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/SongsService');
const SongValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/UsersService');

const AuthenticationsService = require('./services/AuthenticationsService');
const authentications = require('./api/authentications');
const PlaylistsService = require('./services/PlaylistsService');
const BridgesService = require('./services/BridgesService');
const playlists = require('./api/playlists');
const bridges = require('./api/bridges');
const TokenManager = require('./tokenize/TokenManager');
const UserValidator = require('./validator/users');
const AuthenticationValidator = require('./validator/authentications');
const PlaylistValidator = require('./validator/playlists');
const BridgeValidator = require('./validator/bridges');
const CollaborationsService = require('./services/CollaborationsService');
const collaborations = require('./api/collaborations');
const ActivitiesService = require('./services/ActivitiesService');
const activities = require('./api/activities');
const _exports = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/exports');
const StorageService = require('./services/storage/StorageService');
const uploads = require('./api/uploads');
const UploadsValidator = require('./validator/uploads');
const userAlbumLikes = require('./api/userAlbumLikes');
const UserAlbumLikesService = require('./services/UserAlbumLikesService');
const CacheService = require('./services/redis/CacheService');
const config = require('./utils/config');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService(cacheService);
  const albumsService = new AlbumsService(songsService, cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const bridgesService = new BridgesService(cacheService);
  const activitiesService = new ActivitiesService();
  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/coverAlbum'));
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  const server = Hapi.server({
    port: config.app.port,
    host: config.app.host,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('playlist_jwt', 'jwt', {
    keys: config.token.access,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.token.age,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        playlistsService,
        usersService,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: bridges,
      options: {
        bridgesService,
        playlistsService,
        validator: BridgeValidator,
        activitiesService,
      },
    },
    {
      plugin: activities,
      options: {
        activitiesService,
        playlistsService,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportValidator,
        playlistsService,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService,
        albumsService,
        uploadsValidator: UploadsValidator,
      },
    },
    {
      plugin: userAlbumLikes,
      options: {
        service: userAlbumLikesService,
        albumService: albumsService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegegalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
