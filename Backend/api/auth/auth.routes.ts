const express = require("express");
const router = express.Router();
import { authController } from "./auth.controller";

router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.post("/logout", authController.logout);
export default router;
