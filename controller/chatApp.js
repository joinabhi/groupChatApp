const ChatApp=require('../model/chatApp')
const Group=require('../model/group')
const User=require('../model/user')
const sequelize=require('../util/database')

const UserService=require('../service/userservice')
const S3Service=require('../service/s3service')

exports.addChat=async (req, res)=>{
    // const name=req.boby.name;
    console.log('6======+++++', req.user.id)
    // console.log('8----------', name)
    const { name, message, id } = req.body
    console.log({ name, message, id })
    const data=await ChatApp.create({
        name,
        message,
        userId: req.user.id,
        groupId: id
    })
    console.log('15**************', data)
    res.status(201).json({chat:data})
}

exports.getChat =async(req, res)=>{
    try{
        console.log('17_____', req.user.id );
        
        const chats=await ChatApp.findAll();
        res.status(200).json({allChats:chats})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"something went wrong"})
}
}

exports.fetchGroup =async(req, res)=>{
    try{
        const id = req.params.id 
        const group = await Group.findByPk(id);
        res.status(200).json({group})
    }catch(error){
        console.error(error)
        res.status(404).json({message:"group not found"})
}
}

exports.deleteChat = async(req, res, next)=>{
  const chatId=req.params.id;
  console.log('34--------><><><><', req.user.id)
  console.log('35-----------<<<<<<<<>>>>>>>>>>', chatId)
  try{
      await ChatApp.destroy({where:{
        id:chatId,
        userId:req.user.id
      }})
      res.status(200).json({message:'chat deleted successfully'})
  }
  catch(error){
      res.status(500).json({error:error})
  }
}

exports.createGroup = async (req, res, next) => {
  try {
    console.log(req.body);
    const userId = req.body.userId;
    console.log('499999', userId)
    const groupName = req.body.groupName;
    console.log("()()()", groupName)
    const selectedMembers = req.body.selectedMembers;
    console.log("()()()()()", selectedMembers)
    
    const data = await Group.create({
      userId:userId,
      groupName: groupName,
      selectedMembers: selectedMembers
    });

    console.log('15**************', data)
    res.status(201).json({ groupData: data });
    console.log('41___________--------------------', data);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'An error occurred while creating the group.' });
  }
};



exports.getGroups = async(req, res, next)=>{
  try{
   console.log('71-------', req.user.id)
    const groups=await Group.findAll({where:{userId:req.user.id}});
    res.status(200).json({allGroups:groups})
    console.log('73', groups)
}catch(error){
    console.log(error)
    res.status(500).json({message:"something went wrong"})
}
}

exports.deleteGroup=async(req, res, next)=>{
  const groupId=req.params.id;
  console.log('86------------------', groupId)
  try{
    await Group.destroy({where:{id:groupId}})
      res.status(200).json({message:'group deleted successfully'})
  }catch(error){
    console.log(error)
  }
}

// exports.createGroupUsingSocket=async(req, res, next)=>{
//   const {groupName, userId}=req.body;
//   try{
//    const group=await Group.create({groupName});
//    if(userId && userId.length>0){
//     const users= await User.findAll({where:{id:userId}})
//     await group.addUser(users)
//    }
//    res.status(201).json({message:'Group created successfully'})
//   }catch(error){
//     console.log(error)
//     res.status(500).json({error:'An error occurred'})
//   }
// }

exports.uploadFile= async(req, res)=>{
  try{
    const file = req.files.file;
        
        console.log("65++++++++++++++++++++++++++++",file);
        // const stringifiedExpenses=JSON.stringify(expenses)
        // console.log("67__________________",stringifiedExpenses)
        const userId=req.user.id
        console.log('136-------------=========', userId)
        const filename=`File${userId}/${new Date()}.txt`;
       

        const fileUrl=await S3Service.uploadToS3(file.data, filename);
        console.log('70--------', fileUrl)
        res.status(200).json({fileUrl, success:true})
    }catch(err){
        console.log(err)
        res.status(500).json({fileUrl:'Abhi bhi nhi aaya kya', success:false})
    }

}

exports.downloadFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const filename = `File${userId}/${req.params.filename}`; // Assuming the filename is passed as a parameter

    const downloadUrl = await S3Service.generateDownloadUrl(filename);
    res.status(200).json({ downloadUrl, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ downloadUrl: 'Error generating download URL', success: false });
  }
};


