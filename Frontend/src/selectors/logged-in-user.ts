import { selector } from "recoil";
import loggedInUser from "../atoms/logged-in-user";
const loggedInUserSelector = selector({
  key: "loggedInUserSelector",
  get: ({ get }) => {
    return get(loggedInUser);
  },
});

export default loggedInUserSelector;
