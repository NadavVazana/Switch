import { selector } from "recoil";
import isLoading from "../atoms/is-loading";
const isLoadingSelector = selector({
  key: "isLoadingSelector",
  get: ({ get }) => {
    return get(isLoading);
  },
});

export default isLoadingSelector;
