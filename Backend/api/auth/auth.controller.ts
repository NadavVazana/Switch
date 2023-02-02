import { Request, Response } from "express";
import { authService } from "./auth.service";

async function signup(req: Response, res: Request) {
  try {
    const userToAdd = req.body;
    const password = userToAdd.password;
    await authService.signupUser(userToAdd);
    const user = await authService.loginUser({
      email: userToAdd.email,
      password: password,
    });
    const loginToken = await authService.getLoginToken(user);
    res.cookie("loginToken", loginToken);
    res.json(user);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function logout(req: Response, res: Request) {
  try {
    res.clearCookie("loginToken");
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function login(req: Request, res: Response) {
  try {
    const userToLogin = req.body;
    const user = await authService.loginUser(userToLogin);
    const loginToken = await authService.getLoginToken(user);
    res.cookie("loginToken", loginToken);
    res.json(user);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

export const authController = {
  login,
  signup,
  logout,
};
