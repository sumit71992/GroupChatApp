const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const {Op} = require('sequelize');

const postChat = async (req, res, next) => {
  try {
    const message = req.body.message;
    await req.user.createChat({
      message,
      userName: req.user.name,
    });
    return res.status(200).json({ message: "chat added" });
  } catch (err) {
    return res.status(200).json({ message: "Someting wrong", Error: err });
  }
};

const getAllChat = async (req, res) => {
  try {
    const lastMessageId = req.query.lastId || 0;
    const chats = await Chat.findAll({
      where:{
        id:{
          [Op.gt]: lastMessageId
        }
      }
    });

    return res.status(200).json({ chats });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};
module.exports = {
  postChat,
  getAllChat,
};
