const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupsModel");
const UserGroup = require("../models/usersGroupsModel");
const s3Service = require("../services/s3Services");
const path = require("path");
const { Op } = require("sequelize");

const createGroup = async (req, res) => {
  try {
    const groupName = req.body.groupName;
    const group = await req.user.createGroup({
      groupName,
    });
    const groupId = group.id;
    console.log(groupId);
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
    let lastId = req.query.lastId || 0;

    const isInGroup = await UserGroup.findAll({
      where: {
        groupId: groupId,
        userId: req.user.id,
      },
    });
    if (isInGroup) {
      const groupName = await Group.findOne({
        where: {
          id: groupId,
        },
        attributes: ["groupName"],
      });
      const msg = await Chat.findAll({
        where: {
          groupId: groupId,
          id: {
            [Op.gt]: lastId,
          },
        },
        attributes: ["id", "message", "groupId", "userId"],
        include: {
          model: User,
          attributes: ["name"],
        },
      });
      if (msg.length > 0) {
        for (let i of msg) {
          if (i.userId === req.user.id) {
            lastId = msg[0].id;
            return res.status(200).json({ msg, groupName });
          }
        }
      } else {
        return res.status(200).json({ groupName });
      }
    } else {
      return res
        .status(400)
        .json({ message: "You are not part of this group" });
    }
  } catch (err) {
    console.log("Error", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

const addUserToGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const usr = req.body.userid;
    const isAdmin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });
    if (isAdmin) {
      const findGroup = await UserGroup.findAll({
        where: {
          groupId: groupId,
          userId: usr,
        },
      });
      if (findGroup.length < 1) {
        await UserGroup.create({
          userId: usr,
          groupId,
        });
        return res.status(200).json({ message: "Successfully added to group" });
      } else {
        return res
          .status(200)
          .json({ message: "You already part of this group" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Only Admin can add user to this group" });
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

const removeUserFromGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.body.userId;
    const isAdmin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });
    if (isAdmin) {
      const isUser = await UserGroup.findOne({
        where: {
          groupId: groupId,
          userId: userId,
        },
      });
      if (isUser) {
        await UserGroup.destroy({
          where: {
            groupId: groupId,
            userId: userId,
          },
        });
        return res
          .status(401)
          .json({ message: "Successfully removed user from this group" });
      } else {
        return res
          .status(401)
          .json({ message: "this user is not part of this group" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Only Admin can remove user from this group" });
    }
  } catch (err) {
    console.log("Eroor", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

const getAllGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.id;
    const users = await UserGroup.findAll({
      where: {
        groupId: groupId,
      },
      attributes: ["groupId"],
      include: {
        model: User,
        attributes: ["name"],
      },
    });
    const admin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        isAdmin: true,
      },
      include: {
        model: User,
        attributes: ["name"],
      },
    });
    return res
      .status(200)
      .json({ groupMembers: users, adminName: admin.user.name });
  } catch (err) {
    console.log("Eroor", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};

const makeOtherMemberAdmin = async (req, res) => {
  try {
    const groupId = req.params.id;
    const userId = req.body.userId;
    const isAdmin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });
    if (isAdmin) {
      const isOtherAdmin = await UserGroup.findOne({
        where: {
          groupId: groupId,
          userId: userId,
          isAdmin: true,
        },
      });
      if (!isOtherAdmin) {
        await UserGroup.update({
          where: {
            groupId: groupId,
            userId: userId,
          },
          isAdmin: true,
        });
      } else {
        return res
          .status(401)
          .json({ message: "This member already an Admin" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "Only Admin can make other member to admin" });
    }
  } catch (err) {
    console.log("Eroor", err);
    return res.status(500).json({ message: "Something wrong", Error: err });
  }
};
module.exports = {
  createGroup,
  postGroupMessage,
  getGroupMessages,
  addUserToGroup,
  getAllGroups,
  removeUserFromGroup,
  getAllGroupMembers,
  makeOtherMemberAdmin,
};
