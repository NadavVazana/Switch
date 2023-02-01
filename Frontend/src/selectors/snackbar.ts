import { selector } from "recoil";
import snackbar from "../atoms/snackbar";
const snackbarSelector = selector({
  key: "snackbarSelector",
  get: ({ get }) => {
    return get(snackbar);
  },
});

export default snackbarSelector;
