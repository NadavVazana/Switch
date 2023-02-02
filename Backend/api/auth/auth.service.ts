import { AuthDto } from "models/auth";
import { User } from "models/user";
import * as createHttpError from "http-errors";
import * as bcrypt from "bcrypt";
import { dbService } from "../../services/db.service";
import { userService } from "../user/user.service";
const Cryptr = require("cryptr");
const cryptr = new Cryptr(process.env.SECRET1 || "Secret-1234");

const EntityTypes = {
  user: "user",
};

async function collection() {
  return dbService.getCollection("user");
}

async function loginUser(userToLogin: AuthDto) {
  const user = await userService.getUserByEmail(userToLogin.email);

  if (!user) {
    throw new createHttpError.NotFound(`Invalid email`);
  }

  const match = await bcrypt.compare(userToLogin.password, user.password);
  if (!match) {
    throw new createHttpError.NotFound(`Invalid password`);
  }
  delete user.password;
  return user;
}

async function getLoginToken(user: User) {
  return cryptr.encrypt(JSON.stringify(user));
}

async function signupUser(user: User) {
  const existUser = await (await collection()).findOne({ email: user.email });
  if (existUser) {
    throw new createHttpError.Unauthorized("User already exist!");
  }

  const saltRounds = 10;

  if (
    !user.email ||
    !user.firstName ||
    !user.lastName ||
    !user.password ||
    !user.phone
  )
    throw new createHttpError.NotFound("All credentials are required!");

  user.password = await bcrypt.hash(user.password, saltRounds);
  const userToAdd = {
    ...user,
    img: "https://res.cloudinary.com/ds8xkm0ue/image/upload/v1674952478/user-square-svgrepo-com_qt82jb.svg",
  };
  await (await collection()).insertOne(userToAdd);
  delete user.password;
  return user;
}

export const authService = {
  loginUser,

  signupUser,
  getLoginToken,
};

function NotFoundError(entityType: string, entityId: string) {
  return new createHttpError.NotFound(
    `${entityType}'s id: ${entityId} was not found..`
  );
}
