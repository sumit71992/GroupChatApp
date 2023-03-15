const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupsModel");
const UserGroup = require("../models/usersGroupsModel");
const { Op } = require("sequelize");

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
      where: {
        id: {
          [Op.gt]: lastMessageId,
        },
      },
    });

    return res.status(200).json({ chats });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

const createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupname;
    const group = await req.user.createGroup({
      groupName,
      adminName: req.user.name,
    });
    await UserGroup.create({
      message: null,
      userId: req.user.id,
      groupId: group.id,
    });
    return res.status(200).json({ message: "Group created successfully" });
  } catch (err) {
    console.log("Error", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", Error: err });
  }
};

const postGroupMessage = async (req, res) => {
  try {
    const groupId = req.params.id;
    const message = req.body.message;
    await UserGroup.create({
      message,
      userId: req.user.id,
      groupId,
    });
    return res.status(200).json({message:"send successfully"});
  } catch (err) {
    console.log(err);
    return res.ststus(500).json({ message: "Something wrong", Error: err });
  }
};

const getGroupMessages = async(req,res)=>{
  const groupId = req.params.id;
  const msg = await UserGroup.findAll({
    where:{
      groupId : groupId,
    }
  });
  return res.status(200).json({msg});
}
module.exports = {
  postChat,
  getAllChat,
  createGroup,
  postGroupMessage,
  getGroupMessages,
};
