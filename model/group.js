const { DataTypes } = require('sequelize');
const sequelize=require('../util/database');

const Group = sequelize.define('Group', {
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  selectedMembers: {
    type: DataTypes.ARRAY(DataTypes.STRING), // Assuming an array of member IDs
    allowNull: false,
  },
});

module.exports = Group;