const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyNewUser(username);

    const id = `user-${nanoid(16)}`;
    const hasedPassword = await bcrypt.hash(password, 10);
    
    const query = {
      text: 'INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id',
      values: [id, username, hasedPassword, fullname],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('data gagal ditambah');
    }

    return result.rows[0].id;
  }

  async getUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id=$1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('user tidak ditemukan');
    }
  }

  async verifyNewUser(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username=$1',
      values: [username],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthenticationError('Kredential salah');
    }

    const { id, password: hasedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hasedPassword);

    if (!match) {
      throw new AuthenticationError('Kredential tidak sama');
    }

    return id;
  }
}

module.exports = UsersService;
