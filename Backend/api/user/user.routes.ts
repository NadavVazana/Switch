import * as express from "express";
const router = express.Router();
import { userController } from "./user.controller";

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUserById);
router.put("/", userController.updateUser);
router.delete("/:userId", userController.removeUser);

export default router;
