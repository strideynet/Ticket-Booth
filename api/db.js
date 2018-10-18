const config = require('config')
const debug = require('debug')('ticket-boot:db')
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const DB_HOST = config.get('db.host')
const DB_DATABASE = config.get('db.username')
const DB_USER = config.get('db.user')
const DB_PASS = config.get('db.pass')
debug('all db constants loaded')

/* Initialize database */
const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASS,
  database: DB_DATABASE
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
const models = {}

fs.readdirSync('models/').forEach((fileName) => {
  const model = {}

  model.path = path.join(__dirname, 'models/', fileName)
  model.name = fileName.replace(/\.[^/.]+$/, '')
  model.model = sequelize.import(model.path)

  models[model.name] = model
  debug(`loaded ${model.name}`)
})
