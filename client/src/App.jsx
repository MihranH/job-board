import { useState, useEffect } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetch(`${API}/jobs/categories`)
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/jobs?q=${query}&category=${category}&page=${page}&pageSize=${pageSize}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.data);
        setTotal(data.total);
        setLoading(false);
      });
  }, [query, category, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "sans-serif", padding: "0 16px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>Job Board</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", fontSize: 14, border: "1px solid #ccc", borderRadius: 6 }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: "8px 12px", fontSize: 14, border: "1px solid #ccc", borderRadius: 6 }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
        {loading ? "Loading..." : `${total} jobs found`}
      </p>

      {!loading && jobs.length === 0 && (
        <p style={{ color: "#999", textAlign: "center", marginTop: 40 }}>No jobs match your search.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontWeight: 600, fontSize: 15 }}>{job.title}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
              {job.company} · {job.category} · {job.location}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, justifyContent: "center" }}>
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            style={{ padding: "8px 16px", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}
          >
            ← Prev
          </button>
          <span style={{ fontSize: 14, color: "#555" }}>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            style={{ padding: "8px 16px", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}
          >
            Next →
          </button>
        </div>
    </div>
  );
}
