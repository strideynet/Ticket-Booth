const config = require('config')
const logger = require('pino')({
  name: 'database',
  level: process.env.LOG_LEVEL || 'info'
})
const Sequelize = require('sequelize')

const DB_INSTANCE_CONNECTION_NAME = config.get('db.instanceConnectionName')
const DB_SOCKET_PATH = config.get('db.socketPath')
const DB_HOST = config.get('db.host')
const DB_DATABASE = config.get('db.database')
const DB_USER = config.get('db.user')
const DB_PASS = config.get('db.pass')
const DB_PORT = config.get('db.port')

let options = {
  username: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  logging: logger.trace.bind(logger),
  dialect: 'mysql',
  dialectOptions: {
    multipleStatements: true,
  }
}

if (DB_SOCKET_PATH) {
  options.dialectOptions.socketPath = DB_SOCKET_PATH
} else if (DB_INSTANCE_CONNECTION_NAME) {
  options.dialectOptions.socketPath = `/cloudsql/${DB_INSTANCE_CONNECTION_NAME}`
} else {
  options.host = DB_HOST
  options.port = DB_PORT
}


/* Initialize database */
const sequelize = new Sequelize(options)

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
