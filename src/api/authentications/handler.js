class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;
  }

  async postAuthenticationsHandler(request, h) {
    this._validator.validateAuthenticationPayloadPost(request.payload);
    const { username, password } = request.payload;
    
    const id = await this._usersService.verifyUserCredential(username, password);

    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const refreshToken = await this._tokenManager.generateRefreshToken({ id });

    await this._authenticationsService.addRefreshToken(refreshToken);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationsHandler(request, h) {
    this._validator.validateAuthenticationPayloadPutDelete(request.payload);
    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = await this._tokenManager.generateAccessToken({ id });
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthenticationsHandler(request, h) {
    this._validator.validateAuthenticationPayloadPutDelete(request.payload);
    const { refreshToken } = request.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    const response = h.response({
      status: 'success',
      message: 'Berhasil hapus',
    });
    response.code(200);
    return response;
  }
}

module.exports = AuthenticationsHandler;
