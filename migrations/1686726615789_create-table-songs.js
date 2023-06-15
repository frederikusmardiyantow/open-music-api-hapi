/* eslint-disable camelcase */

// exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
      type: 'INT',
      notNull: false,
    },
    albumId: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"albums"',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
