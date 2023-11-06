const express = require("express");
const router = express.Router();
const usersController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/all", auth, usersController.getAllUsers);
router.post("/add", usersController.addUser);
router.patch("/update", auth, usersController.updateUser);
router.delete("/delete", auth, usersController.deleteUser);

module.exports = router;
