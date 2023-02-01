import { AlertColor } from "@mui/material";
import { atom } from "recoil";

const snackbar = atom({
  key: "snackbar",
  default: { isOpen: false, msg: "", variant: "" as AlertColor },
});

export default snackbar;
