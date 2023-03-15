const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define("groups",{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      groupName:Sequelize.STRING,
      adminName: Sequelize.STRING,
});
module.exports=Group;