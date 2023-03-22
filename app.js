const path = require('path');
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

const port = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json())

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);
app.use((req, res) => {
  if(req.url=="/"){
    res.sendFile(path.join(__dirname, `views/signin.html`));
  }else{
    res.sendFile(path.join(__dirname, `views/${req.url}`));
  }
});

Chat.belongsTo(User);
User.hasMany(Chat);

Group.belongsTo(User);
User.hasMany(Group);


UserGroup.belongsTo(Group);
UserGroup.belongsTo(User);
Group.hasMany(UserGroup);
User.hasMany(UserGroup)


sequelize.sync().then(() => {
  app
    .listen(port, () => {
      console.log("App is running on port", port);
    })
}).catch((err) => console.log(err));
