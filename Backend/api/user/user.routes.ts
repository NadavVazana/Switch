import * as express from "express";
import { Request, Response } from "express";
const router = express.Router();
import { userController } from "./user.controller";

router.get("/", (req: Request, res: Response) => {
  try {
    userController.getUsers(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.get("/:userId", (req: Request, res: Response) => {
  try {
    userController.getUserById(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.put("/", (req: Request, res: Response) => {
  try {
    userController.updateUser(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.delete("/:userId", (req: Request, res: Response) => {
  try {
    userController.removeUser(req, res);
  } catch (error) {
    res.send(error);
  }
});

export default router;
