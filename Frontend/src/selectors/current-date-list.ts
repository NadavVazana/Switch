import { selector } from "recoil";
import currentDateList from "../atoms/current-date-list";

const currentDateListSelector = selector({
  key: "currentDateListSelector",
  get: ({ get }) => {
    return get(currentDateList);
  },
});

export default currentDateListSelector;
