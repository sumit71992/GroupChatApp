const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupsModel");
const UserGroup = require("../models/usersGroupsModel");
const path = require('path');
const { Op } = require("sequelize");

const createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const group = await req.user.createGroup({
      groupName,
    });
    const groupId = group.id;
    console.log(groupId)
    await UserGroup.create({
      isAdmin: true,
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
    await req.user.createChat({
      message,
      userName: req.user.name,
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
    const isInGroup = await UserGroup.findAll({
      where: {
        groupId: groupId,
        userId: req.user.id
      }
    });
    if (isInGroup) {
      const groupName = await Group.findOne({
        where: {
          id: groupId
        },
        attributes: ['groupName']
      });
      const msg = await Chat.findAll({
        where: {
          groupId: groupId,
        },
        attributes: ['id', 'message', 'groupId', 'userId'],
        include: {
          model: User,
          attributes: ["name"],
        },
      });
      if(msg.length>0){
        for (let i of msg) {
          if (i.userId === req.user.id) {
            return res.status(200).json({ msg, groupName });
          }
        }
      }else{
        return res.status(200).json({groupName});
      }
      
    } else {
      return res.status(400).json({ message: "You are not part of this group" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

const addUserToGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const findGroup = await UserGroup.findAll({
      where: {
        groupId: groupId,
        userId: req.user.id
      },
    });
    if (!findGroup) {
      await UserGroup.create({
        userId: req.user.id,
        groupId,
      });
      return res.status(200).json({ message: "Successfully added to group" });
    } else {
      return res.status(200).json({ message: "You already part of this group" });
    }

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
const getAllGroups = async (req, res) => {
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
  getAllGroups,
};
