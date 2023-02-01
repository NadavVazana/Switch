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
};

async function login(user: Auth): Promise<LoggedInUser | null> {
  try {
    const loggedUser = await httpService.post<Auth, LoggedInUser>(
      "auth/login",
      user
    );
    sessionStorage.setItem("loggedInUser", JSON.stringify(loggedUser));
    return loggedUser;
  } catch (error) {
    return null;
  }
}
function getLoggedInUser(): LoggedInUser | null {
  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser") || " {}"
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

async function signup(user: User): Promise<LoggedInUser | null> {
  try {
    return await httpService.post("auth/signup", user);
  } catch (error) {
    return null;
  }
}

async function logout(): Promise<null | void> {
  try {
    sessionStorage.clear();
    await httpService.post("auth/logout");
  } catch (error) {
    return null;
  }
}
