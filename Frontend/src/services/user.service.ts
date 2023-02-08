import { Auth } from "../models/auth";
import { User } from "../models/user";
import { httpService } from "./http.service";
import { LoggedInUser } from "../models/logged-in-user";

export const userService = {
  login,
  signup,
  logout,
  updateUser,
  getLoggedInUser,
  updateStorage,
};

async function login(user: Auth): Promise<LoggedInUser | null> {
  try {
    const loggedUser = await httpService.post<Auth, LoggedInUser>(
      "auth/login",
      user
    );
    localStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
    return loggedUser;
  } catch (error) {
    return null;
  }
}
function getLoggedInUser(): LoggedInUser | null {
  const loggedInUser = JSON.parse(
    localStorage.getItem("loggedInUser") || " {}"
  );
  if (!Object.keys(loggedInUser).length) {
    return null;
  }
  return loggedInUser;
}
async function updateUser(user: LoggedInUser): Promise<LoggedInUser | null> {
  try {
    return await httpService.put("user", user);
  } catch (error) {
    return null;
  }
}

function updateStorage(user: LoggedInUser) {
  localStorage.clear();
  localStorage.setItem("loggedInUser", JSON.stringify(user));
}

async function signup(user: User): Promise<LoggedInUser | null> {
  try {
    if (!localStorage.getItem("alreadySigned")) {
      localStorage.setItem("alreadySigned", "signed");

      return await httpService.post("auth/signup", user);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function logout(): Promise<null | void> {
  try {
    localStorage.clear();
    await httpService.post("auth/logout");
  } catch (error) {
    return null;
  }
}
