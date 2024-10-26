const express = require("express");
const { isAuth } = require("./../controllers/auth-controller");
const { getTags, postCreateTag } = require("../controllers/user-controller");

const router = express.Router();

router.route("/tags").get(isAuth, getTags).post(isAuth, postCreateTag);

module.exports = router;
