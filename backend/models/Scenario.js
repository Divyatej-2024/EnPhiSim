import mongoose from "mongoose";

const ScenarioSchema = new mongoose.Schema(
  {
    category: String,
    level_no: String,
    scenarios: [mongoose.Schema.Types.Mixed],
  },
  { collection: "scenarios" }
);

const Scenario = mongoose.model("Scenario", ScenarioSchema);
export default Scenario;