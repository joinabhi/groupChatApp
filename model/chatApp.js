const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const ChatApp=sequelize.define('mes',{
id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    message:Sequelize.STRING,
    name:Sequelize.STRING,

});

module.exports=ChatApp;