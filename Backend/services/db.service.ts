import { MongoClient } from "mongodb";

import config from "../config";

export const dbService = { getCollection };

// Database Name
const dbName = "switch_db";

var dbConn = null;

async function getCollection(collectionName: string) {
  try {
    const db = await connect();

    const collection = await db.collection(collectionName);

    return collection;
  } catch (err) {
    throw err;
  }
}

async function connect() {
  if (dbConn) return dbConn;
  console.log("here");

  try {
    const client = await MongoClient.connect(config["config"].dbURL);

    const db = client.db(dbName);
    dbConn = db;
    return db;
  } catch (err) {
    throw err;
  }
}
