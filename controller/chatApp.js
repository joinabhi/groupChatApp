const ChatApp=require('../model/chatApp')
const Group=require('../model/group')


exports.addChat=async (req, res, next)=>{
    // const name=req.boby.name;
    console.log('6======+++++', req.user.id)
    const name=req.body.name;
    console.log('8----------', name)
    const message=req.body.message;
    const data=await ChatApp.create({
        name:name,
        message:message,
        userId: req.user.id
    })
    console.log('15**************', data)
    res.status(201).json({chat:data})
}

exports.getChat =async(req, res, next)=>{
    try{
        console.log('17_____', req.user.id )
        const chats=await ChatApp.findAll();
        res.status(200).json({allChats:chats})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"something went wrong"})
}
}

exports.createGroup = async(req, res, next)=>{
  const groupName=req.body.groupName;
  console.log("()()()",groupName)
  const selectedMembers=req.body.selectedMembers;
  console.log("()()()()()", selectedMembers)

  const data=await Group.create({
    groupName,
    selectedMembers
  })
  console.log('15**************', data)
  res.status(201).json({groupData:data})
  console.log('41___________--------------------',data)
}

exports.joinGroup = async(req, res, next)=>{

}