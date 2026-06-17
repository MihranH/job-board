const express = require("express");
const cors = require("cors");
const jobs = require("./jobs.json");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/jobs/categories", (req, res) => {
  const categories = [...new Set(jobs.map((j) => j.category))].sort();
  res.json(categories);
});

app.get("/jobs", (req, res) => {
  const q = req.query.q || "";
  const category = req.query.category || "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;

  const byCategory = jobs.filter((j) =>
    category ? j.category === category : true
  );

  const paginated = byCategory.slice((page - 1) * pageSize, page * pageSize);

  const filtered = paginated.filter((j) => j.title.includes(q));

  res.json({
    data: filtered,
    total: byCategory.length,
    page,
    pageSize,
  });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
