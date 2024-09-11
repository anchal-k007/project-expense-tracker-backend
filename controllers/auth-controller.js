const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user-model");
const errorCreator = require("./../utils/error-creator");

exports.signup = async (req, res, next) => {
  const { email, password, name, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(errorCreator("password and confirmPassword do not match", 400));
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (err) {
    console.log("An error occurred while hashing the password");
    return next(err);
  }

  const newUser = new UserModel({
    email,
    name,
    password: hashedPassword,
  });

  try {
    const userFound = await UserModel.findOne({ email: email });
    if (userFound) {
      return next(errorCreator(`User with email ${email} already exists`, 400));
    }
  } catch (err) {
    console.log(
      "An error occurred while checking if user with the email already exists the password"
    );
    return next(err);
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
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await UserModel.findOne({ email });
    if (!foundUser) {
      return next(
        errorCreator(`No user exists with the email = ${email}`, 404)
      );
    }

    const isPasswordEqual = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordEqual) {
      return next(errorCreator("Incorrect password entered", 400));
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
      token,
    });
  } catch (err) {
    console.log("an error occurred while logging in");
    return next(err);
  }
};

exports.isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return next(
      errorCreator(
        "No authorization header present, cannot authenticate user",
        400
      )
    );
  }
  const jwtToken = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET_STRING_DEV
    );
    if (!decodedToken) {
      return next(errorCreator("Invalid jwt token", 400));
    }
    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(errorCreator("jwt expired", 400));
    } else if (err instanceof jwt.JsonWebTokenError) {
      return next(errorCreator("jwt malformed"), 400);
    }
    return next(err);
  }
};
