const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const postChat = async (req, res, next) => {
  try {
    const message = req.body.message;
    await req.user.createChat({
      message,
      userName: req.user.name
    });
    return res.status(200).json({ message: "chat added" });
  } catch (err) {
    return res.status(200).json({ message: "Someting wrong", Error: err });
  }
};

const getAllChat = async(req,res)=>{
    try{
        const chats = await Chat.findAll();
        // for(let i in chats){
        //     const user = await User.findOne({where:{id:chats[i].userId}});
        //     chats[i].name= user.name;
        // }
        // console.log(chats[0])
        return res.status(200).json({chats});
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Something wrong", Error:err});
    }
}
module.exports = {
  postChat,
  getAllChat,
};
