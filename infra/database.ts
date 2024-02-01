import dotenv from "dotenv";
import mongoose from "mongoose";
import Errors from "./errors";

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config();
}

let dbClient: mongoose.Connection | null = null;

function database(): mongoose.Connection {
  try {
    if (!dbClient) {
      const connectionUrl = `${process.env.MONGO_URL}`;
      dbClient = mongoose.createConnection(connectionUrl);
    }
    
    return dbClient;
  } catch (error) {
    throw new Error("Error connecting to MongoDB");
  }
}

export default database();