import { selector } from "recoil";
import isModal from "../atoms/is-modal";
const isModalSelector = selector({
  key: "isModalSelector",
  get: ({ get }) => {
    return get(isModal);
  },
});

export default isModalSelector;
