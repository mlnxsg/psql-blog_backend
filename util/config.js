require('dotenv').config()

const DATABASE_URL = process.env.TESTING === 'true'
  ? process.env.TEST_DATABASE_URL
  : process.env.DATABASE_URL

const PORT = process.env.TESTING === 'true'
  ? process.env.TEST_PORT
  : PORT

module.exports = {
  DATABASE_URL,
  PORT,
  SECRET: process.env.SECRET
}