import { userService } from "./user.service";
import { Request, Response } from "express";

async function getUsers(req: Request, res: Response) {
  try {
    const users = await userService.query();

    res.json(users);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function updateUser(req: Request, res: Response) {
  try {
    const user = req.body;
    const updatedUser = await userService.update(user);

    res.json(updatedUser);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function signUp(req: Request, res: Response) {
  try {
    const { firstName, lastName, password, email, phone, role } = req.body;
    const user = { firstName, lastName, password, email, phone, role };
    const account = await userService.addUser(user);

    res.json(
      `The user with the name of: ${user.firstName} ${user.lastName} has been added!`
    );
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function removeUser(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    await userService.deleteUser(userId);
    res.send(`User with the id of: ${userId} has been removed!`);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

async function getUserById(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    const user = await userService.getUser(userId);
    res.json(user);
  } catch (error) {
    res.status(error.status).send(error);
  }
}

export const userController = {
  getUsers,
  signUp,
  getUserById,
  removeUser,
  updateUser,
};
