import * as express from "express";
import { Request, Response } from "express";
const router = express.Router();
import { authController } from "./auth.controller";

router.post("/login", (req: Request, res: Response) => {
  try {
    authController.login(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.post("/signup", (req: Request, res: Response) => {
  try {
    authController.signup(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.post("/logout", (req: Request, res: Response) => {
  try {
    authController.logout(req, res);
  } catch (error) {
    res.send(error);
  }
});

export default router;
