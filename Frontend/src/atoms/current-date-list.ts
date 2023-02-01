import { emptyDate } from "./../services/calendar.service";
import { atom } from "recoil";
const currentDateList = atom({
  key: "currentDateList",
  default: emptyDate,
});

export default currentDateList;
