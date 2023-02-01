import { atom } from "recoil";

const selectedDay = atom({
  key: "selectedDay",
  default: new Date(),
});

export default selectedDay;
