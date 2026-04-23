const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// In-memory results storage
const results = {
  "Option A": 0,
  "Option B": 0,
  "Option C": 0,
};

app.get("/", (req, res) => {
  res.json({ message: "Result App", results });
});

app.get("/results", (req, res) => {
  res.json(results);
});

app.post("/results/:option", (req, res) => {
  const option = req.params.option;
  if (results.hasOwnProperty(option)) {
    results[option]++;
    return res.json({ option, total: results[option] });
  }
  res.status(400).json({ error: "Invalid option" });
});

app.listen(PORT, () => {
  console.log(`Result service running on port ${PORT}`);
});
