var config: { dbURL: string };
import * as dotenv from "dotenv";
dotenv.config();

// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === "production") {
  // we are in production - return the prod set of keys
  config = require("./prod");
} else {
  // we are in development - return the dev keys!!!
  config = require("./dev");
}

export default config;
