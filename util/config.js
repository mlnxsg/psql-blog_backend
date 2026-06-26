require('dotenv').config()

const DATABASE_URL = process.env.TESTING === 'true'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

module.exports = {
  DATABASE_URL,
  PORT: process.env.PORT,
  SECRET: process.env.SECRET
}