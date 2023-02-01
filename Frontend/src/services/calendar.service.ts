import { AuthDate } from "./../models/authDate";
import { httpService } from "./http.service";
import { Date } from "../models/date";
export const calendarService = {
  getDateList,
  addDate,
  updateDate,
  deleteSwitch,
  getDateListByOwnerId,
  getAllDates,
};

async function getAllDates(): Promise<Date[] | null> {
  try {
    return await httpService.get("calendar");
  } catch (error) {
    return null;
  }
}
async function getDateList(date: string): Promise<Date> {
  try {
    return await httpService.get(`calendar/?date=${date}`);
  } catch (error) {
    return emptyDate;
  }
}

async function addDate(date: AuthDate): Promise<Date | null> {
  try {
    return await httpService.post("calendar", date);
  } catch (error) {
    return null;
  }
}

async function getDateListByOwnerId(ownerId: string): Promise<Date[] | null> {
  try {
    return await httpService.get(`calendar/${ownerId}`);
  } catch (error) {
    return null;
  }
}

async function updateDate(date: {
  isTake: boolean;
  startHour: string;
  endHour: string;
  flexible: boolean;
  comment: string;
  _id: string;
}): Promise<Date | null> {
  try {
    return await httpService.put("calendar", date);
  } catch (error) {
    return null;
  }
}

async function deleteSwitch(date: string, dateId: string) {
  try {
    await httpService.delete(`calendar/${dateId}/${date}`);
  } catch (error) {}
}

export const emptyDate = new Date(
  "",
  [],
  "",
  { _id: "", phone: "", fullName: "" },
  "",
  "",
  false,
  false,
  ""
);
