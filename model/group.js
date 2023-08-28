const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('group', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  selectedMembers: {
    type: DataTypes.ARRAY(DataTypes.INTEGER), // Use ARRAY type for an array of integers
    defaultValue: [], // Default value is an empty array
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
  }
});

module.exports = Group;
