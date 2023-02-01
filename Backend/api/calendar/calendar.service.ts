import { Collection, ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import { utilService } from "../../services/util.service";
import { Switch } from "models/switch";
import * as createHttpError from "http-errors";

async function collection(): Promise<Collection> {
  return dbService.getCollection("calendar");
}

async function query() {
  let calendar = await (await collection()).find({}).toArray();

  if (!calendar) {
    throw new createHttpError.NotFound(`Could\'nt get the calendar`);
  }
  return calendar;
}

function isDayPassed(date: Date) {
  const now = new Date();
  if (date.getMonth() + 1 > now.getMonth() + 1) {
    if (date.getFullYear() >= now.getFullYear()) {
      return false;
    }
  }
  if (date.getMonth() + 1 === now.getMonth() + 1) {
    if (
      date.getDate() + 1 >= now.getDate() + 1 &&
      date.getFullYear() >= now.getFullYear()
    )
      return false;
  }
  return true;
}
async function insertSwitch(switchInfo: Switch): Promise<Switch> {
  switchInfo = { ...switchInfo, _id: utilService.makeId(24) };
  let date = await (await collection()).findOne({ date: switchInfo.date });
  if (!date) {
    const insertInfo = await (
      await collection()
    ).insertOne({
      date: switchInfo.date,
      switches: [switchInfo],
    });
    if (!insertInfo.acknowledged) {
      throw new createHttpError.BadRequest("Could'nt add a switch");
    }
  } else {
    const switches = [...date.switches, switchInfo];

    date.switches = switches;

    const updateInfo = await (
      await collection()
    ).updateOne({ date: switchInfo.date }, { $set: date });
    if (!updateInfo.acknowledged) {
      throw new createHttpError.BadRequest("Could'nt add a switch");
    }
  }
  return switchInfo;
}

async function getDateById(dateId: string, date: string) {
  const calendar = await (await collection()).findOne({ date });

  return calendar.switches.find((date) => date._id === dateId);
}

async function getDateListByDate(date: string) {
  return await (await collection()).findOne({ date });
}
async function deleteSwitchById(dateId: string, date: string): Promise<void> {
  const dateList = await (await collection()).findOne({ date });
  const switchIndex = dateList.switches.findIndex(
    (date) => date._id === dateId
  );

  if (switchIndex === -1) {
    throw new createHttpError.NotFound("Could'nt delete the switch");
  }

  dateList.switches.splice(switchIndex, 1);
  const updateInfo = await (
    await collection()
  ).updateOne({ date: dateList.date }, { $set: dateList });
  if (!updateInfo.acknowledged) {
    throw new createHttpError.NotFound("Could'nt delete the switch");
  }

  await _cleanUp();
}

async function _cleanUp(): Promise<void> {
  const calendar = await (await collection()).find({}).toArray();
  let cleanCalendar = calendar.filter((date) => date.switches.length);
  cleanCalendar = calendar.filter((date) => !isDayPassed(new Date(date.date)));

  await (await collection()).deleteMany({});
  if (cleanCalendar.length) {
    await (await collection()).insertMany(cleanCalendar);
  }
}

async function getDateByOwnerId(ownerId: string) {
  const calendar = await (await collection()).find({}).toArray();
  let ownerList = [];

  calendar.forEach((date) => {
    date.switches.forEach((swtch) => {
      if (swtch.owner._id === ownerId) {
        ownerList.push(swtch);
      }
    });
  });
  return ownerList;
}

async function update(updatedSwitch: Switch): Promise<void> {
  const date = await (await collection()).findOne({ date: updatedSwitch.date });
  console.log(updatedSwitch);

  const switchIndex = date.switches.findIndex(
    (date) => date._id === updatedSwitch._id
  );

  if (switchIndex === -1) {
    throw new createHttpError.NotFound("Could'nt update the switch");
  }
  date.switches.splice(switchIndex, 1, updatedSwitch);
  const updateInfo = await (
    await collection()
  ).updateOne({ date: date.date }, { $set: date });
  if (!updateInfo.acknowledged) {
    throw new createHttpError.NotFound("Could'nt update the switch");
  }
}

export const calendarService = {
  query,
  insertSwitch,
  deleteSwitchById,
  update,
  getDateById,
  getDateListByDate,
  getDateByOwnerId,
};
