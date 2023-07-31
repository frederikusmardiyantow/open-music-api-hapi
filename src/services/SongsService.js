const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class SongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addSong({
    title, year, genre, performer, duration, albumId, 
  }) {
    const nano = nanoid(16);
    const id = `song-${nano}`;
    const query = {
      text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }
    await this._cacheService.delete('list_songs');
    return result.rows[0].id;
  }

  async getSongs() {
    try {
      const result = await this._cacheService.get('list_songs');
      return JSON.parse(result);
    } catch (error) {
      const result = await this._pool.query('SELECT id, title, performer FROM songs');
      const data = result.rows;
      await this._cacheService.set('list_songs', JSON.stringify(data));
      return data;
    }
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT id, title, year, performer, genre, duration, "albumId" FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    
    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async getSongByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    
    return result.rows;
  }

  async getSongByTitleOrPerformer(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(performer) LIKE LOWER($2)',
      values: [`%${title}%`, `%${performer}%`],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    
    return result.rows;
  }

  async getSongByTitleAndPerformer(title, performer) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
      values: [`%${title}%`, `%${performer}%`],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu dengan title dan performer tersebut tidak ditemukan');
    }
    
    return result.rows;
  }

  async editSongById(id, {
    title, year, genre, performer, duration, albumId, 
  }) {
    const query = {
      text: 'UPDATE songs SET title=$1, year=$2, genre=$3, performer=$4, duration=$5, "albumId"=$6 WHERE id=$7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
    await this._cacheService.delete('list_songs');
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal menghapus lagu. Id tidak ditemukan');
    }
    await this._cacheService.delete('list_songs');
  }
}

module.exports = SongsService;
