const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const sequelize = require("../util/database");

const signup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, password, phone } = req.body;
    const signedUser = await User.findOne({
      where: { email: email },
      transaction: t,
    });
    if (!signedUser) {
      const hashedPwd = await bcrypt.hash(password, 10);
      await User.create(
        {
          name,
          email,
          password: hashedPwd,
          phone,
        },
        { transaction: t }
      );
      await t.commit();
      console.log("Signed up Successfully");
      return res.status(200).json({ message: "Successfully Signed up" });
    } else {
      await t.rollback();
      return res.json({ message: "User already signed up" });
    }
  } catch (err) {
    await t.rollback();
    console.log("error", err);
    return res
      .status(400)
      .json({ message: "Something went wrong", Error: err });
  }
};

const authUser=(id,email)=>{
  return jwt.sign({userId:id, userEmail:email}, process.env.JWT_SECRET);
};

const signin = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email }, transaction:t});
    if(user){
      const signedUser = await bcrypt.compare(password, user.password);
      if(signedUser){
        await t.commit();
        return res.status(200).json({message:"Signin success", token: authUser(user.id,user.email)});
      }else{
        await t.commit();
        return res.status(401).json({message:"User not authorised"})
      }
    }else{
      await t.commit();
      return res.status(404).json({message:"User not found"})
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", Error: err });
  }
};

module.exports = {
  signup,
  signin,
};
