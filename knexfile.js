// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './database/didact.db3'
    },
    useNullAsDefault: true,
    pool:
    {
      afterCreate: (conn, done) =>
      {
        conn.run('PRAGMA foreign_keys = ON', done)
      },
    },
    migrations: {directory: './database/migrations'},
    seeds: {directory: './database/seeds'},
  },

  testing: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    pool:
    {
      afterCreate: (conn, done) =>
      {
        conn.run('PRAGMA foreign_keys = ON', done)
      },
    },
    migrations: {directory: './database/migrations'},
    seeds: {directory: './database/seeds'},
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.HEROKU_POSTGRESQL_COBALT_URL || process.env.DATABASE_URL,
    pool: {
    },
    migrations: {directory: './database/migrations'},
    seeds: {directory: './database/seeds'},
  }

};
