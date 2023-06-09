const path = require("path");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const CronJob = require('cron').CronJob;

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const groupRoutes = require("./routes/groupRoutes");

const User = require("./models/userModel");
const Chat = require("./models/chatModel");
const Group = require("./models/groupsModel");
const UserGroup = require("./models/usersGroupsModel");
const Archive = require("./models/archiveModel");

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/group", groupRoutes);
app.use((req, res) => {
  if (req.url == "/") {
    res.sendFile(path.join(__dirname, `views/signin.html`));
  } else {
    const qry = req.url.split("?")[0];
    qry
      ? res.sendFile(path.join(__dirname, `views/${qry}`))
      : res.sendFile(path.join(__dirname, `views/${req.url}`));
  }
});

Chat.belongsTo(User);
User.hasMany(Chat);

Group.belongsTo(User);
User.hasMany(Group);

UserGroup.belongsTo(Group);
UserGroup.belongsTo(User);
Group.hasMany(UserGroup);
User.hasMany(UserGroup);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("App is running on port", port);
    });
  })
  .catch((err) => console.log(err));
  var job = new CronJob({

    cronTime: '00 00 00 * * * ',
    onTick: async function () {
      const response=await Chat.findAll()
      for(let i=0;i<response.length;i++){
       const data=await Archive.create({
           message:response[i].message,
           userId:response[i].userId,
           groupId:response[i].groupId,
           userName:response[i].userName
       })
      await Chat.destroy({where:{id:response[i].id}});
      }
    },
    start: true,
    runOnInit: false
});