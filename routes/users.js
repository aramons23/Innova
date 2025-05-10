const express = require("express")
const routerUsers = express.Router()
const userController = require("../controllers/users")
const {verifyToken} = require('../middleware/auth');

routerUsers.post("/createUser", userController.createUser)
routerUsers.post("/login", userController.login)

module.exports = routerUsers

