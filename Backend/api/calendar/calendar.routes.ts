import * as express from "express";
const router = express.Router();
import { Request, Response } from "express";
import { calendarController } from "./calendar.controller";

router.get("/", (req: Request, res: Response) => {
  try {
    calendarController.getCalendar(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.post("/", (req: Request, res: Response) => {
  try {
    calendarController.addSwitch(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.delete("/:dateId/:date", (req: Request, res: Response) => {
  try {
    calendarController.deleteSwitch(req, res);
  } catch (error) {
    res.send(error);
  }
});
router.put("/", calendarController.updateSwitch);
router.get("/:ownerId", (req: Request, res: Response) => {
  try {
    calendarController.getDateByOwner(req, res);
  } catch (error) {
    res.send(error);
  }
});

export default router;
