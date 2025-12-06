import mongoose from "mongoose";

const dummySchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    }
},{timestamps: true})

export const Dummy = mongoose.model("Dummy", dummySchema)