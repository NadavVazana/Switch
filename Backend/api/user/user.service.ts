import { ObjectId } from "mongodb";
import { dbService } from "../../services/db.service";
import * as createHttpError from "http-errors";
import * as bcrypt from "bcrypt";
import { User } from "models/user";

const EntityType = {
  User: "User",
};

async function collection() {
  return dbService.getCollection("user");
}

async function getUserByEmail(email: string) {
  return await (await collection()).findOne({ email });
}

async function query() {
  return await (await collection()).find({}).toArray();
}

async function getUser(userId: string) {
  const user = await (
    await collection()
  ).findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw NotFoundError(EntityType.User, userId);
  }
  delete user.password;
  return user;
}

async function deleteUser(userId: string) {
  const deleteInfo = await (
    await collection()
  ).deleteOne({ _id: new ObjectId(userId) });
  if (!deleteInfo.acknowledged) {
    throw NotFoundError(EntityType.User, userId);
  }
}

async function update(user: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  _id: string;
}) {
  const userToSave = {
    ...user,
    _id: new ObjectId(user._id),
  };

  const updateInfo = await (
    await collection()
  ).updateOne({ _id: userToSave._id }, { $set: userToSave });

  if (!updateInfo.acknowledged) {
    throw new createHttpError.NotFound("Could not update user's details..");
  }
  return userToSave;
}

async function addUser(user: User) {
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

  await (await collection()).insertOne(user);
  return user;
}

export const userService = {
  query,
  addUser,
  getUser,
  deleteUser,
  getUserByEmail,
  update,
};

function NotFoundError(entityType: string, entityId: string) {
  return new createHttpError.NotFound(
    `${entityType}'s id: ${entityId} was not found..`
  );
}
