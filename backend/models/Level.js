import mongoose from "mongoose";

const LevelSchema = new mongoose.Schema(
  {
    id: Number,
    Level_no: String,
    page_title: String,
    Hint: String,
    js_path: String,

    category: String,
    from_and_to: String,
    phish_email: String,
    crct_email: String,

    level_text: String,
    subj: String,

    correct_option: String,
    neutral_option: String,
    wrong_option: String,

    template_type: String
  },
  { collection: "levelDataset" }
);

export default mongoose.model("Level", LevelSchema);
