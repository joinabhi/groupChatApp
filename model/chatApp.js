const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const ChatApp=sequelize.define('message',{
id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING,
    message:Sequelize.STRING,
    userId:Sequelize.INTEGER, 
    groupId:Sequelize.INTEGER,

});

module.exports=ChatApp;