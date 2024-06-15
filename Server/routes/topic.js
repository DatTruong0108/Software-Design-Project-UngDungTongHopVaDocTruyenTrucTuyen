const express = require("express");
const route = express.Router();
// const multer = require('multer');
// const fs = require('fs');

const NovelController = require("../controllers/NovelController");

route.get("/:name", NovelController.topic);

module.exports = route;