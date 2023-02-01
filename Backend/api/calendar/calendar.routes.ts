import * as express from "express";
const router = express.Router();
import { calendarController } from "./calendar.controller";

router.get("/", calendarController.getCalendar);
router.post("/", calendarController.addSwitch);
router.delete("/:dateId/:date", calendarController.deleteSwitch);
router.put("/", calendarController.updateSwitch);
router.get("/:ownerId", calendarController.getDateByOwner);

export default router;
