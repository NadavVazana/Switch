const express = require("express");
const router = express.Router();
const calendarController = require("api/calendar/calendar.controller");

router.get("/", calendarController.getCalendar);
router.post("/", calendarController.addSwitch);
router.delete("/:dateId/:date", calendarController.deleteSwitch);
router.put("/", calendarController.updateSwitch);
router.get("/:ownerId", calendarController.getDateByOwner);
export default router;
