import { selector } from "recoil";
import selectedDay from "../atoms/selected-day";
const selectedDaySelector = selector({
  key: "selectedDaySelector",
  get: ({ get }) => {
    return get(selectedDay);
  },
});

export default selectedDaySelector;
