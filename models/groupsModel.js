const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define("groups",{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      groupName:Sequelize.STRING,
});
module.exports=Group;