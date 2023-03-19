const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupsModel");
const UserGroup = require("../models/usersGroupsModel");
const { Op } = require("sequelize");

const createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const group = await req.user.createGroup({
      groupName,
    });
    const groupId = 2;
    console.log(groupId)
    await UserGroup.create({
      isAdmin: 1,
      groupId,
      userId: req.user.id,
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
        attributes: ["name"],
      },
    });
    const result = msg.filter((v) => v.message !== null);
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
};
const removeDuplicates = (obj) => {
  let newArray = [];
  let uniqueObject = {};
  for (let i in obj) {
    objGroupId = obj[i]["groupId"];
    uniqueObject[objGroupId] = obj[i];
  }
  for (i in uniqueObject) {
    newArray.push(uniqueObject[i]);
  }
  return newArray;
};
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
        attributes: ["groupName"],
      },
    });
    return res.status(200).json({
      message: "Fetched Successfully",
      groups: removeDuplicates(groups),
    });
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};
module.exports = {
  createGroup,
  postGroupMessage,
  getGroupMessages,
  addUserToGroup,
  getallgroups,
};
