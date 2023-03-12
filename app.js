const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const User = require('./models/userModel');
const Chat = require('./models/chatModel');

const port = process.env.PORT || 3000;

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(express.json())

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

Chat.belongsTo(User);
User.hasMany(Chat);
sequelize.sync().then((res) => {
  app
    .listen(port, () => {
      console.log("App is running on port", port);
    })
}).catch((err) => console.log(err));
