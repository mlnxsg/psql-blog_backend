const { DataTypes, Model } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.STRING,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: {
        args: [1991],
        msg: 'year must be at least 1991'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: 'year cannot be greater than the current year'
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog