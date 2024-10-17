const express = require("express");
const { isAuth } = require("../controllers/auth-controller");
const { getAllDocuments } = require("../controllers/query-controller");

const router = express.Router();

router.get("/all?:startDate&:endDate", isAuth, getAllDocuments);

module.exports = router;