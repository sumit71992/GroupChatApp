const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupsModel");
const UserGroup = require("../models/usersGroupsModel");
const s3Service = require("../services/s3Services");
const { Op } = require("sequelize");

const postChat = async (req, res, next) => {
  try {
    const message = req.body.message;
    // const image =  req.files.image;
    // console.log("<<<<<<<<<<<files>>>",image);
    // if(image){
    //   const filename = `${req.user.id}/${Date.now()}////////${image}`;
    //   const url = await s3Service.uploadTos3(image,filename);
    //   await req.user.createChat({
    //     message:url,
    //     userName: req.user.name,
    //   });
    // }else{
      await req.user.createChat({
        message,
        userName: req.user.name,
      });
    // }
    return res.status(200).json({ message: "chat added" });
  } catch (err) {
    console.log("Error",err);
    return res.status(200).json({ message: "Someting wrong", Error: err });
  }
};

const getAllChat = async (req, res) => {
  try {
    const lastMessageId = req.query.lastId || 0;
    const chats = await Chat.findAll({
      where: {
        id: {
          [Op.gt]: lastMessageId,
        },
        groupId:{
          [Op.eq]:null
        }
      },
    });
    return res.status(200).json({ chats });
  } catch (err) {
    console.log("Error",err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

module.exports = {
  postChat,
  getAllChat,
};
