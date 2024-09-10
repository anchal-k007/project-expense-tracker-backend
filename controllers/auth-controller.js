const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user-model");

exports.signup = async (req, res, next) => {
  const { email, password, name, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "fail",
      message: "password and confirmPassword do not match",
    });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log("An error occurred while hashing the password");
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
    });
  }

  const newUser = new UserModel({
    email,
    name,
    password: hashedPassword,
  });

  try {
    const userFound = await UserModel.findOne({ email: email });
    if (userFound) {
      return res.status(400).json({
        status: "fail",
        message: `User with ${email} already exists`,
      });
    }
  } catch (err) {
    console.log(
      "An error occurred while checking if user with the email already exists the password"
    );
    console.log(err);
    return res.status(500).json({
      status: "fail",
      message: "internal server error",
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
        email: createdNewUser.email,
      },
    });
  } catch (err) {
    console.log("An error occurred while creating the user");
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({
        status: "fail",
        message: `No user exists with the email = ${email}`,
      });
    }

    const isPasswordEqual = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordEqual) {
      return res.status(404).json({
        status: "fail",
        message: "Incorrect password entered",
      });
    }

    const token = jwt.sign(
      {
        userId: foundUser._id,
      },
      process.env.JWT_SECRET_STRING_DEV,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token
    });

  } catch (err) {
    console.log("an error occurred while logging in");
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "internal server error"
    });
  }
};

exports.isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if(!authHeader) {
    console.log("No Authorization header present");
    return res.status(401).json({
      status: "fail",
      message: "Cannot authenticate user"
    });
  }
  const jwtToken = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_STRING_DEV);
    if(!decodedToken) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid jwt token"
      });
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    if(err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: "fail",
        message: "jwt token expired"
      });
    } else if(err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: "fail",
        message: "jwt malformed"
      });
    }
    console.log("An error occured while authenticating the user");
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "internal server error"
    });
  }
}