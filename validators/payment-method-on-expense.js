const PaymentMethodModel = require("../models/payment-method-model");

// Used to validate that the payment method being added to the expense is valid
const validatePaymentMethodAddedToExpense = async (paymentMethodId, userId) => {
  const searchedPaymentMethod = await PaymentMethodModel.findOne({
    _id: paymentMethodId,
    user: userId,
  });
  if (!searchedPaymentMethod) {
    return false;
  }
  return true;
};

module.exports = {
  validatePaymentMethodAddedToExpense,
};
