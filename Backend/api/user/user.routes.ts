const express = require("express");
const router = express.Router();
const userController = require("api/user/user.controller");

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUserById);
router.put("/", userController.updateUser);
router.delete("/:userId", userController.removeUser);

export default router;
