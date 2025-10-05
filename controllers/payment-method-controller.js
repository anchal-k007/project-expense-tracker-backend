const PaymentMethodModel = require("../models/payment-method-model");
const UserModel = require("../models/user-model");
const errorCreator = require("../utils/error-creator");
const { filterProperties } = require("../utils/filter-properties");

exports.getPaymentMethod = async (req, res, next) => {
  const userId = req.userId;
  const { paymentMethodId } = req.params;
  try {
    if (!paymentMethodId) {
      return next(errorCreator("Please provide a payment method id", 404));
    }
    const paymentMethod = await PaymentMethodModel.findById(paymentMethodId).populate({
      path: "user",
      select: { _id: 1 },
    });
    if (!paymentMethod) {
      return next(errorCreator(`No payment method with the id = ${paymentMethodId} exists`, 404));
    }
    if (paymentMethod.user._id.toString() !== userId) {
      return next(errorCreator(`No payment method with the id = ${paymentMethodId} exists for this user`, 404));
    }
    return res.status(200).json({
      status: "success",
      paymentMethod,
    });
  } catch (err) {
    console.log("An error occurred while fetching the details of the payment method");
    console.log(err);
    throw err;
  }
};

exports.postCreatePaymentMethod = async (req, res, next) => {
  const userId = req.userId;
  const { name: paymentMethodName, active } = req.body;
  const newPaymentMethod = new PaymentMethodModel({
    name: paymentMethodName,
    active: active,
    user: userId,
  });
  try {
    // create the new payment method
    const savedPaymentMethod = await newPaymentMethod.save();
    if (!savedPaymentMethod) {
      return next(errorCreator("Could not create payment method. Please try again later", 500));
    }
    // Update the user with the newly created payment method
    try {
      UserModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            paymentMethod: savedPaymentMethod,
          },
        },
        { returnDocument: "after" },
      );
      // Return the new payment method
      return res.status(201).json({
        status: "success",
        paymentMethod: savedPaymentMethod,
      });
    } catch (err) {
      console.log(
        "An error occurred while adding the payment method to the corresponding user. Deleting the created payment method",
      );
      console.log(err);
      savedPaymentMethod.deleteOne();
      throw err;
    }
  } catch (err) {
    console.log("An error occurred while creating the payment method. Please try again later");
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        error: err.errors.name.properties,
      });
    }
    throw err;
  }
};

exports.putUpdatePaymentMethod = async (req, res, next) => {
  const userId = req.userId;
  const { paymentMethodId } = req.params;
  try {
    // Check payment method id exists or not
    if (!paymentMethodId) {
      return next(errorCreator("Please provide a payment method id", 404));
    }
    const paymentMethod = await PaymentMethodModel.findById(paymentMethodId).populate({
      path: "user",
      select: { _id: 1 },
    });
    // Check if payment method exists for the given payment method id
    if (!paymentMethod) {
      return next(errorCreator(`No payment method with the id = ${paymentMethodId} exists`, 404));
    }
    // Check if payment method belongs to the current user
    if (paymentMethod.user._id.toString() !== userId) {
      return next(errorCreator(`No payment method with the id = ${paymentMethodId} exists for this user`, 404));
    }
    const validProperties = ["name", "active"];
    const dataToUpdate = filterProperties(req.body, validProperties);
    console.log({ dataToUpdate, reqBody: req.body });
    try {
      const updatedPaymentMethod = await paymentMethod.save(dataToUpdate);
      return res.status(200).json({
        status: "success",
        paymentMethod: updatedPaymentMethod,
      });
    } catch (err) {
      console.log("Failed to update the payment method, please try again later");
      console.log(err);
      throw err;
    }
  } catch (err) {
    console.log("Failed to update the payment method, please try again later");
    console.log(err);
    throw err;
  }
};
