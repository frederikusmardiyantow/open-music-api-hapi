/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('bridges', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('bridges', 'unique_song_and_playlist', 'UNIQUE(song_id, playlist_id)');

  pgm.addConstraint('bridges', 'fk_song.id_songs.id', 'FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE');

  pgm.addConstraint('bridges', 'fk_playlist.id_playlists.id', 'FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('bridges');
  pgm.dropConstraint('bridges', 'unique_song_and_playlist');
  pgm.dropConstraint('bridges', 'fk_song.id_songs.id');
  pgm.dropConstraint('bridges', 'fk_playlist.id_playlists.id');
};
