import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

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