import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB Connected Successfully !! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error){
        console.error(`MONGODB connection FAILED: ${error}`)
        process.exit(1) // process node.js ka feature hai 
    }
}

export default connectDB