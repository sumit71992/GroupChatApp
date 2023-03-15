const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Chat = sequelize.define("chats",{
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  },
  message:Sequelize.STRING,
  userName: Sequelize.STRING,
});

module.exports = Chat;
