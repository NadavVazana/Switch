import { emptyDate } from "./../services/calendar.service";
import { atom } from "recoil";
const allDates = atom({
  key: "allDates",
  default: [emptyDate],
});

export default allDates;
