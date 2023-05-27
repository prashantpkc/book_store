const express = require("express")
const { getBooks, createBook } = require("../controller/bookController")
const { createCustomer  } = require("../controller/customerController")
const { createUser, login } = require("../controller/userController")

const router = express.Router()

//user API
router.post("/users", createUser)
router.post("/login", login)

//custmers API

router.post("/createCustomer", createCustomer)
// router.post("/login", login)

//Book API
router.post("/createBook", createBook)
router.get("/books", getBooks)


module.exports = router