import express from "express";
import Eaction from "../models/E_action.js"; 
import axios from "axios";

const router = express.Router();

const ML_SERVER = process.env.ML_SERVER_URL;
router.get("/analysis/UserID", async(requestAnimationFrame,res) => {
    try {
        const { UserID } = requestAnimationFrame.params;
        const actions = await Eaction.find({UserID});

        const mlresponse = await axios.post("${ML_SERVER}/predict",{ data:actions 

});
res.json({
            raw_actions: actions,
            accuracy: mlResponse.data.accuracy,
            probabilities: mlResponse.data.probabilities,
            risk_score: mlResponse.data.risk_score
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Server Error" });
    
}});

export default router;