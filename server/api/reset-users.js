import { MongoClient } from "mongodb";
import { seedUsers } from "../seedUsers.js";

const uri = process.env.MONGO;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("test");
    const users = db.collection("users");

    await users.deleteMany({});
    await users.insertMany(seedUsers);

    res.json({ success: true, message: "Reset Done" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}