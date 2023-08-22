const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const UserGroup = sequelize.define('UserGroup', {
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
});

module.exports=UserGroup