const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const User = require('./user');
const Group= require('./group');


const UserGroup = sequelize.define('usergroup', {
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    }
});

UserGroup.belongsTo(User, { foreignKey: 'userId' });
UserGroup.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(UserGroup, { foreignKey: 'userId' });
Group.hasMany(UserGroup, { foreignKey: 'groupId' });

module.exports=UserGroup;