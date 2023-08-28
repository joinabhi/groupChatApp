const express=require('express');
// const http=require('http');
// const socketIo=require('socket.io')
const app=express();
const cors=require('cors');

const dotenv=require('dotenv')
dotenv.config();

const bodyParser=require('body-parser');
const userRoute=require('./route/user');
const chatRoute=require('./route/chatApp')
const createRoute=require('./route/chatApp')
const joinRoute=require('./route/chatApp')
const getGroupRoute=require('./route/chatApp')
const delGroupRoute=require('./route/chatApp')
const sequelize=require('./util/database.js');

// const groupRoute=require('./route/chatApp')





const User = require('./model/user');
const ChatApp= require('./model/chatApp');
const Group= require('./model/group');
const UserGroup= require('./model/UserGroup');


app.use(cors())
app.use(bodyParser.json());
app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/create', createRoute);
app.use('/join', joinRoute);
app.use('/get', getGroupRoute);
app.use('/group', delGroupRoute)
// app.use('/group2', groupRoute)

User.hasMany(ChatApp)
ChatApp.belongsTo(User)

User.belongsToMany(Group, { through: UserGroup })
Group.belongsToMany(User, { through: UserGroup })

User.hasMany(UserGroup, { foreignKey: 'userId' });
Group.hasMany(UserGroup, { foreignKey: 'groupId' });

Group.hasMany(ChatApp)
ChatApp.belongsTo(Group, { foreignKey: 'groupId' })

sequelize.sync().then(()=>{
  app.listen(5100,()=>{
    console.log(`your server is running on port 5100`)
  })
}).catch(error => console.log(error));
