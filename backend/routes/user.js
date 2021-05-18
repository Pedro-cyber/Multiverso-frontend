const express= require('express');
const UserController = require ('../controllers/user');


const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.put("/updateprofile/:id", UserController.updateProfile);

router.get("/userprofile/:id", UserController.getUserProfile);

module.exports= router;
