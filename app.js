const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupRoutes = require("./routes/groupRoutes");

const User = require('./models/userModel');
const Chat = require('./models/chatModel');
const Group = require('./models/groupsModel');
const UserGroup = require('./models/usersGroupsModel');

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(express.json())

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);

Chat.belongsTo(User);
User.hasMany(Chat);

User.belongsToMany(Group,{through: UserGroup});
Group.belongsToMany(User,{through: UserGroup});


sequelize.sync().then(() => {
  app
    .listen(port, () => {
      console.log("App is running on port", port);
    })
}).catch((err) => console.log(err));
