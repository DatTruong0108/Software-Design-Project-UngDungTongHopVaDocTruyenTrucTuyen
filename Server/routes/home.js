const express=require('express');
const route=express.Router();
const multer = require('multer');
const fs = require('fs');


const HomeController=require('../controllers/HomeController');

route.get('/',HomeController.index);

module.exports=route;