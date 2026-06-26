const { Sequelize } = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations() // 调用下面已经定义好的函数
    console.log('Connected to the database')
  } catch (error) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

module.exports = {
  connectToDatabase, sequelize
}