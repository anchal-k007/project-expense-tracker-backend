const express = require("express");
const { isAuth } = require("./../controllers/auth-controller");
const { getTags, postCreateTag, putUpdateTag } = require("../controllers/user-controller");
const {
  getPaymentMethod,
  postCreatePaymentMethod,
  putUpdatePaymentMethod,
} = require("../controllers/payment-method-controller");

const router = express.Router();

router.route("/tags").get(isAuth, getTags).post(isAuth, postCreateTag);

router.route("/tags/:tagId").put(isAuth, putUpdateTag);

router.route("/payment-method").post(isAuth, postCreatePaymentMethod);

router.route("/payment-method/:paymentMethodId").get(isAuth, getPaymentMethod).put(isAuth, putUpdatePaymentMethod);

module.exports = router;
