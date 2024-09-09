const UserModel = require("../models/user-model");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res, next) => {
  const { email , password , name } = req.body;
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log("An error occurred while hashing the password");
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error"
    });
  }
  
  const newUser = new UserModel({
    email,
    name,
    password: hashedPassword
  });
  
  try {
    const userFound = await UserModel.findOne({email: email});
    if(userFound) {
      return res.status(400).json({
        status: "fail",
        message: `User with ${email} already exists`
      });
    }
  } catch(err) {
    console.log("An error occurred while checking if user with the email already exists the password");
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error"
    });
  }

  try {
    const createdNewUser = await newUser.save();
    return res.status(201).json({
      status: "success",
      message: "user created successfully",
      user: {
        userId: createdNewUser._id,
        name: createdNewUser.name,
        email: createdNewUser.email
      }
    });
  } catch (err) {
    console.log("An error occurred while creating the user");
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "internal server error"
    });
  }
}