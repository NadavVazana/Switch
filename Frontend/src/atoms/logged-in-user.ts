import { atom } from "recoil";
import { LoggedInUser } from "../models/logged-in-user";
const loggedInUser = atom({
  key: "loggedInUser",
  default: {} as LoggedInUser,
});

export default loggedInUser;
