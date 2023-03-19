const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Chat = sequelize.define("chats",{
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  message:Sequelize.STRING,
  userName: Sequelize.STRING,
  groupId: Sequelize.INTEGER
});

module.exports = Chat;
