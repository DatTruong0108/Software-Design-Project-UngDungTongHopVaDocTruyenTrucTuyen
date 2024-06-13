const express = require("express");
const route = express.Router();
// const multer = require('multer');
// const fs = require('fs');

const FileController = require("../controllers/FileController");

const HomeController = require("../controllers/HomeController");
route.get("/search", HomeController.searchGet);

route.get("/ajax", HomeController.solve);
route.get("/:slug", HomeController.novelDetail);
route.get("/", HomeController.index);
route.post("/search", HomeController.searchPost);

route.post("/export", FileController.fileExport);
module.exports = route;