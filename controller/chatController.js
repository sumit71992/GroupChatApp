const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const postChat = async (req, res, next) => {
  try {
    const message = req.body.message;
    await req.user.createChat({
      message,
    });
    return res.status(200).json({ message: "chat added" });
  } catch (err) {
    return res.status(200).json({ message: "Someting wrong", Error: err });
  }
};
module.exports = {
  postChat,
};
