import mongoose from "mongoose";

const Eaction =new mongoose.Schema({
    UserID: String,
    LevelID:String,
    Action: String,
    timestamp:{type: Date, default: Date.now}
});

export default mongoose.model("E_action", Eaction);