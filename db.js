const config = require('config')
const logger = require('pino')({
  name: 'database',
  level: process.env.LOG_LEVEL || 'info'
})
const Sequelize = require('sequelize')

const DB_HOST = config.get('db.host')
const DB_DATABASE = config.get('db.database')
const DB_USER = config.get('db.user')
const DB_PASS = config.get('db.pass')
const DB_PORT = config.get('db.port')

/* Initialize database */
const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  port: DB_PORT,
  logging: logger.trace.bind(logger),
  dialect: 'mysql',
  dialectOptions: {
    multipleStatements: true
  }
})

/* Attempt connection to check details */
sequelize
  .authenticate()
  .then(() => {
    logger.info('db succesfully connected')
  })
  .catch((err) => {
    logger.fatal(err, 'db connection failed')

    process.exit(1)
  })

/* Load in models */
sequelize.import('./models/order.js')
sequelize.import('./models/participant.js')
sequelize.import('./models/user.js')

for (const model in sequelize.models) {
  logger.info('setting up associations for ' + model)
  sequelize.models[model].associate && sequelize.models[model].associate(sequelize.models)
}

module.exports = sequelize
