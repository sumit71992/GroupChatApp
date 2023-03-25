const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Archive = sequelize.define("archives",{
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  message:Sequelize.STRING,
  userName: Sequelize.STRING,
  groupId: Sequelize.INTEGER,
  userId: Sequelize.INTEGER
});

module.exports = Archive;
