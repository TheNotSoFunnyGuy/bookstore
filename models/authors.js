'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Authors.belongsToMany(models.Book, {
        through: 'author_books',
        as: 'books',
        foreignKey: 'author_id',
        otherKey: 'book_id',
        timestamps: false
      })
    }
  };
  Authors.init({
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Authors',
    timestamps: false,
    tableName: 'authors'
  });
  return Authors;
};