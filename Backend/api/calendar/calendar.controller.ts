import { calendarService } from "./calendar.service";
import { Request, Response } from "express";

async function getCalendar(req: Request, res: Response) {
  try {
    if (Object.keys(req.query).length) {
      const date = await calendarService.getDateListByDate(req.query.date);
      res.json(date);
    } else {
      const calendar = await calendarService.query();

      res.json(calendar);
    }
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function getDateByOwner(req: Request, res: Response) {
  try {
    const ownerId = req.params.ownerId;
    const dates = await calendarService.getDateByOwnerId(ownerId);
    res.json(dates);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function addSwitch(req: Request, res: Response) {
  try {
    const switchInfo = req.body;
    const addedSwitch = await calendarService.insertSwitch(switchInfo);
    res.json(addedSwitch);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function deleteSwitch(req: Request, res: Response) {
  try {
    const dateId = req.params.dateId;
    const date = req.params.date;

    await calendarService.deleteSwitchById(dateId, date);
    res.send("Deleted Successfully!");
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function updateSwitch(req: Request, res: Response) {
  try {
    const updatedSwitch = req.body;

    await calendarService.update(updatedSwitch);
    res.json(updatedSwitch);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

export const calendarController = {
  getCalendar,
  addSwitch,
  deleteSwitch,
  updateSwitch,
  getDateByOwner,
};
