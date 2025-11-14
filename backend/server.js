import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://pdivyatej2003_db_user:TEJ_2025@enphisimdb.objuvdc.mongodb.net/?appName=EnPhiSimdb")
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

const levelSchema = new mongoose.Schema({}, {strict:false});
const Level = mongoose.model("Level",levelSchema, "levelsDataset");

app.get("/api/levels", async (req,res) =>{
try{
  const levels = await Level.find();
  res.json(levels);
}
catch (err) {
  res.status(500).json({message: err.message});
}
}
  );

// Example route that talks to ML Server
app.post('/api/levels/:id', async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    res.json(level);
  } catch (err) {
    res.status(404).json({ error: 'Level not found' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
