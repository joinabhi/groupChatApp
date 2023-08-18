const express=require('express');
const app=express();
const cors=require('cors');

const dotenv=require('dotenv')
dotenv.config();

const bodyParser=require('body-parser');
const userRoute=require('./route/user');
const sequelize=require('./util/database.js');


app.use(cors())
app.use(bodyParser.json());
app.use('/user', userRoute);


sequelize.sync().then(()=>{
  app.listen(5100,()=>{
    console.log(`your server is running on port 5100`)
  })
}).catch(error => console.log(error));
