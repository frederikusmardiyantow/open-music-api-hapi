const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const NotFoundError = require('../exceptions/NotFoundError');
const InvariantError = require('../exceptions/InvariantError');

// digunakan untuk assign song to playlist
class BridgesService { 
  constructor() {
    this._pool = new Pool();
  }

  async postSongToPlaylistBySongId(idSong, idPlaylist) {
    const searchSong = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [idSong],
    };
    const result = await this._pool.query(searchSong);
    
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }
    
    const id = `bridges-${nanoid(16)}`;
    const addSong = {
      text: 'INSERT INTO bridges VALUES ($1, $2, $3) RETURNING id',
      values: [id, idSong, idPlaylist],
    };
    const result2 = await this._pool.query(addSong);
    
    if (!result2.rows.length) {
      throw new InvariantError('Gagal Insert Song to Playlist');
    }
  }

  async getSongsInPlaylist(id) {
    const query1 = {
      text: 'SELECT p.id, p.name, u.username FROM playlists p JOIN users u ON (p.owner = u.id) WHERE p.id = $1',
      values: [id],
    };
    const result1 = await this._pool.query(query1);

    if (!result1.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const query2 = {
      text: 'SELECT s.id, s.title, s.performer FROM bridges b JOIN songs s ON (b.song_id = s.id) WHERE b.playlist_id = $1',
      values: [id],
    };
    const result2 = await this._pool.query(query2);

    // menambahkan property songs(playlist2) di object dari playlist(result1)
    result1.rows[0].songs = result2.rows; 
    return result1.rows[0];
  }

  async deleteSongFromPlaylistBySongId(idSong, idPlaylist) {
    const searchSong = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [idSong],
    };
    const result = await this._pool.query(searchSong);
    if (!result.rows.length) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    const query = {
      text: 'DELETE FROM bridges WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [idPlaylist, idSong],
    };
    await this._pool.query(query);
  }
}

module.exports = BridgesService;
