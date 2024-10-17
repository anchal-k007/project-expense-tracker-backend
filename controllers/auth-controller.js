const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user-model");
const errorCreator = require("./../utils/error-creator");

function createToken(user) {
  const secretKey =
    (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod")
    ? process.env.JWT_SECRET_STRING_PROD
    : process.env.JWT_SECRET_STRING_DEV;
  const token = jwt.sign(
    {
      userId: user._id,
    },
    secretKey,
    { expiresIn: "1D" }
  );

  return token;
}

exports.signup = async (req, res, next) => {
  // password and confirmPassword are matched in the validation middleware
  const { email, password, name } = req.body;
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
    const token = createToken(createdNewUser);
    return res.status(201).json({
      status: "success",
      message: "user created successfully",
      token,
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

    const token = createToken(foundUser);

    const userDataToSend = {
      userId: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
    };

    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      token,
      user: userDataToSend,
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
  const secretKey =
    (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod")
    ? process.env.JWT_SECRET_STRING_PROD
    : process.env.JWT_SECRET_STRING_DEV;
  try {
    const decodedToken = jwt.verify(
      jwtToken,
      secretKey
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

exports.verify = async (req, res, next) => {
  const userId = req.userId;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return next(errorCreator("No user found", 400));
    }

    const userDataToSend = {
      name: foundUser.name,
      email: foundUser.email,
      _id: foundUser._id,
    };

    const newToken = createToken(foundUser);

    return res.status(200).json({
      status: "success",
      message: "Valid user",
      user: userDataToSend,
      token: newToken,
    });
  } catch (err) {
    console.log("An error occurred while verifying");
    console.log(err);
  }
};
