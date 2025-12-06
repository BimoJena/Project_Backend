import dotenv from "dotenv"
dotenv.config()

import connectDB from "./db/index.js";
import app from "./app.js";

connectDB()
.then(()=>{
    app.on("Error", (err) => {
        console.log("Err", err)
        throw err
    })
    app.listen(process.env.PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`MongoDB connection Failed: ${err}`)
})












/*


--------isse proof hua ki manually db bananne ki need nahi hai jb db bana loge or jb usme first collection bana k first record daaloge db automatically mongodb me show hone lagega

import { Dummy } from "./models/dummy.model.js"; // path correct rakhna

connectDB().then(async () => {
  const user = await Dummy.create({ username: "bimochan" });
  console.log("Dummy data inserted:", user);
});


*/
