const axios = require("axios");

router.post("/predict", async (req, res) => {
  try {
    const response = await axios.post(
      `${process.env.ML_API_URL}/predict`,
      req.body
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "ML API unreachable" });
  }
});
