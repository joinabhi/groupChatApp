const ChatApp=require('../model/chatApp')


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
        const chats=await ChatApp.findAll({where:{userId:req.user.id}});
        res.status(200).json({allChats:chats})
    }catch(error){
        console.log(error)
        res.status(500).json({message:"something went wrong"})
}
}