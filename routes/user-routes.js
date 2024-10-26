const express = require("express");
const { isAuth } = require("./../controllers/auth-controller");
const { getTags, postCreateTag, putUpdateTag } = require("../controllers/user-controller");

const router = express.Router();

router.route("/tags").get(isAuth, getTags).post(isAuth, postCreateTag);

router.route("/tag/:tagId").put(isAuth, putUpdateTag);

module.exports = router;
