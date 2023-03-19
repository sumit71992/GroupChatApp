const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Usergroup = sequelize.define("usersgroups",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    isAdmin: Sequelize.BOOLEAN,
    groupId: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
});
module.exports=Usergroup;