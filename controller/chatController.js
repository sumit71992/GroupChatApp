const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupsModel");
const UserGroup = require("../models/usersGroupsModel");
const { Op, Sequelize } = require("sequelize");
const Admin = require("../models/adminModel");

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
    const groupName = req.body.groupName;
    const group = await req.user.createGroup({
      groupName,
    });
    await UserGroup.create({
      message: null,
      userId: req.user.id,
      groupId: group.id,
    });
    await req.user.createAdmin({
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
    console.log(req.user.id);
    await UserGroup.create({
      message,
      userId: req.user.id,
      groupId,
    });
    return res.status(200).json({ message: "send successfully" });
  } catch (err) {
    console.log(err);
    return res.ststus(500).json({ message: "Something wrong", Error: err });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.id;
    const msg = await UserGroup.findAll({
      where: {
        groupId: groupId,
      },
      include: {
        model: User,
        attributes: ['name']
      }
    });
    const result = msg.filter(v => v.message !== null);
    for (let i of msg) {
      if (i.userId === req.user.id) {
        return res.status(200).json({ result });
      }
    }

    return res.status(400).json({ message: "You are not part of this group" });
    // if(msg.userId===req.user.id){
    // return res.status(200).json({ msg });
    // }else{
    //   return res.status(400).json({message:"You are not part of this group"});
    // }
  } catch (err) {
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

const addUserToGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    await UserGroup.create({
      message: null,
      userId: req.user.id,
      groupId: groupId,
    });
    return res.status(200).json({ message: "Successfully added to group" });
  } catch (err) {
    console.log("Eroor", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
}
const removeDuplicates = (obj) => {
  let newArray = [];
  let uniqueObject = {};
  for (let i in obj) {
    objGroupId = obj[i]['groupId'];
    uniqueObject[objGroupId] = obj[i];
  }
  for (i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }
  return newArray;
}
const getallgroups = async (req, res) => {
  try {
    const groups = await UserGroup.findAll({
      where: {
        userId: req.user.id,

      },
      attributes: ["id", "groupId", "userId"],
      groupId: {
        distinct: true,
      },
      include: {
        model: Group,
        attributes: ['groupName']
      }
    });
    return res.status(200).json({ message: "Fetched Successfully", groups:removeDuplicates(groups) })
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
}
module.exports = {
  postChat,
  getAllChat,
  createGroup,
  postGroupMessage,
  getGroupMessages,
  addUserToGroup,
  getallgroups
};
