const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Usergroup = sequelize.define("usersgroups",{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    message: Sequelize.STRING,
});
module.exports=Usergroup;