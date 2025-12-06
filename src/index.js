import dotenv from "dotenv"
dotenv.config()

import connectDB from "./db/index.js";
import { Dummy } from "./models/dummy.model.js"; // path correct rakhna

connectDB().then(async () => {
  const user = await Dummy.create({ username: "bimochan" });
  console.log("Dummy data inserted:", user);
});
