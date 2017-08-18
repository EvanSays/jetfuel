// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.'postgres://zuiqekxgtfbndy:085cf5a9dd113e982f73e2fb2e0574fffd2989176e10af560b38a99365d58ce4@ec2-54-221-205-186.compute-1.amazonaws.com:5432/d6hoaqj5v7ogop' + `?ssl=true`,
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory:'./db/seeds/dev'
    },
    useNullAsDefault: true,
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
  }

};
