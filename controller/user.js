const User=require('../model/user');
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require('dotenv').config()

const signUp=async(req, res)=>{
  //Existing user check
  const {name, email, password, phoneNumber}=req.body;
  try{
    const existingUser=await User.findOne({where:{email}});
    if(existingUser){
      return res.status(400).json({message:"user already exists"});
    }
    //hashedPassword
    const hashedPassword=await bcrypt.hash(password, 10)
    //user Creation
    const result=await User.create({
          name:name,
          email:email,
          password:hashedPassword,
          phoneNumber:phoneNumber
        
    })
    //generate token
    const token=jwt.sign({name:name, email:email, userId:result.id }, process.env.SECRET_KEY)
    return res.status(201).json({user:result, message:"Registration Successful", token:token})
   
  }catch(error){
    console.log(error);
    res.status(500).json({message:"something went wrong"})
  }
}


const getUser = async(req, res, next)=>{
  try{
  const users=await User.findAll();
  res.status(200).json({allUsers:users})
  }catch(error){
    console.log(error)
  }
}


const signIn = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    console.log("41", existingUser)
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const {name:name, email: useremail, id: userId, ispremiumuser } = existingUser;
    const token = jwt.sign(
      { name:name, email: useremail, userId: userId, ispremiumuser },
      process.env.SECRET_KEY
    );

    console.log("Token:", token);
    res
      .status(201)
      .json({ user: existingUser, message: "User logged in successfully", token:token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports={signUp,getUser,signIn}