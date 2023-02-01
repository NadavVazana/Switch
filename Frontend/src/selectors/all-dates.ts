import { selector } from "recoil";
import allDates from "../atoms/all-dates";

const allDatesSelector = selector({
  key: "allDatesSelector",
  get: ({ get }) => {
    return get(allDates);
  },
});

export default allDatesSelector;
