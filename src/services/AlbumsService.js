const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class AlbumsService {
  constructor(songService, cacheService) {
    this._pool = new Pool();
    this._songs = songService;
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    await this._cacheService.delete('list_albums');
    return result.rows[0].id;
  }

  async addEditCoverAlbum(idAlbum, url) {
    const query = {
      text: 'UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id',
      values: [url, idAlbum],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async getAlbums() {
    try {
      const result = await this._cacheService.get('list_albums'); console.log('masuk');
      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query('SELECT * FROM albums');
      const data = result.rows;
      await this._cacheService.set('list_albums', JSON.stringify(data));
      return data;
    }
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    const songs = await this._songs.getSongByAlbumId(id);

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      ...result.rows[0],
      songs,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
    await this._cacheService.delete('list_albums');
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus album. Id tidak ditemukan');
    }
    await this._cacheService.delete('list_albums');
  }
}

module.exports = AlbumsService;
