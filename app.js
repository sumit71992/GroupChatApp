const express = require("express");
const cors = require("cors");

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoutes");

const User = require('./models/userModel')

const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json())

app.use("/user", userRoutes);

sequelize.sync().then((res) => {
  app
    .listen(port, () => {
      console.log("App is running on port", port);
    })
}).catch((err) => console.log(err));
