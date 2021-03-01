'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
// const env = process.env.NODE_ENV || 'development'
// const config = require(__dirname + '/../config/config.json')[env]

const db_config = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECIONT,
  timezone: '+08:00',
  config: {
    define: { freezeTableName: true },
    pool: { max: 10, min: 0, acquire: 60000, idle: 10000 },
  },
}

const db = {}

let sequelize

sequelize = new Sequelize(
  db_config.database,
  db_config.username,
  db_config.password,
  {
    ...db_config,
    // logging: false
  }
)

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = sequelize['import'](path.join(__dirname, file))

    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
