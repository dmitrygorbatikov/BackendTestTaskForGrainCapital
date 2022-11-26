require('dotenv').config()

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host:     process.env.DB_HOST     || '127.0.0.1',
      port:     process.env.DB_PORT     || 3306,
      database: process.env.DB_NAME     || 'topic',
      user:     process.env.DB_USER     || 'root',
      password: process.env.DB_PASSWORD || '123456'
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    }
  },

};
