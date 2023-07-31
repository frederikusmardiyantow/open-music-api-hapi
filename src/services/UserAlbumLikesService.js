const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async postLike(idUser, idAlbum) {
    const id = `like-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES ($1, $2, $3) RETURNING id',
      values: [id, idUser, idAlbum],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal memberikan like album');
    }
    await this._cacheService.delete(`like:${idAlbum}`);
  }

  async cekUserLike(idUser, idAlbum) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [idUser, idAlbum],
    };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError('Anda sudah menyukai album ini!');
    }
  }

  async getLikesbyAlbum(idAlbum) {
    try {
      const result = await this._cacheService.get(`like:${idAlbum}`);
      const data = JSON.parse(result);
      data.cache = true;
      return data;
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [idAlbum],
      };
      const result = await this._pool.query(query);
      result.cache = false;
    
      await this._cacheService.set(`like:${idAlbum}`, JSON.stringify(result));
      return result;
    }
  }

  async deleteUserLikebyAlbum(idUser, idAlbum) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [idUser, idAlbum],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus. Id User dengan id Album tidak diketahui');
    }
    await this._cacheService.delete(`like:${idAlbum}`);
  }
}

module.exports = UserAlbumLikesService;
