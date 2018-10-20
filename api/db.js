const config = require('config')
const debug = require('debug')('ticket-boot:db')
const Sequelize = require('sequelize')

const DB_HOST = config.get('db.host')
const DB_DATABASE = config.get('db.database')
const DB_USER = config.get('db.user')
const DB_PASS = config.get('db.pass')
debug('all db constants loaded')

/* Initialize database */
const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE,
  dialect: 'mysql'
})

/* Attempt connection to check details */
sequelize
  .authenticate()
  .then(() => {
    debug('db succesfully connected')
  })
  .catch((err) => {
    debug('db connection failed')
    debug(err)

    process.exit(1)
  })

/* Load in models */
sequelize.models = {}

sequelize.models.Customer = sequelize.import('./models/customer.js')
sequelize.models.Order = sequelize.import('./models/order.js')
sequelize.models.Participant = sequelize.import('./models/participant.js')
sequelize.models.User = sequelize.import('./models/user.js')

for (const model in sequelize.models) {
  debug('setting up associations for ' + model)
  sequelize.models[model].associate && sequelize.models[model].associate(sequelize.models)
}

module.exports = sequelize
