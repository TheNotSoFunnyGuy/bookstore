'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsToMany(models.Authors, {
        through: 'author_books',
        as: 'authors',
        foreignKey: 'book_id',
        otherKey: 'author_id',
        timestamps:false
      })
    }
  }
  Book.init({
    title: DataTypes.STRING,
    author1: DataTypes.STRING,
    publisher: DataTypes.STRING,
    genre: DataTypes.STRING,
    numberOfPages: DataTypes.INTEGER,
    coverImage: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Book',
    timestamps:false,
    tableName: 'books'
  });
  return Book;
};