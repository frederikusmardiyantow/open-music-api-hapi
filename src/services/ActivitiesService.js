const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async postActivity(playlistId, userId, songId, action) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO activities VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, userId, songId, action, time],
    };
    const result = await this._pool.query(query);
    
    if (!result.rows.length) {
      throw new InvariantError('gagal insert activity');
    }
  }

  async getActivities(playlistId) {
    const query = {
      text: 'SELECT u.username, s.title, a.action, a.time FROM activities a JOIN songs s ON (a.song_id = s.id) JOIN users u ON (a.user_id = u.id) WHERE a.playlist_id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('tidak ditemukan aktifitas');
    }
    return result.rows;
  }
}

module.exports = ActivitiesService;
