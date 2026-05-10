import { useState } from "react";
import API from "../api/api.js";
import { Link } from "react-router-dom";
import "../CSS/MyBookings.css";

const STATUS_CLASS = {
  confirmed: "mb-status--confirmed",
  pending:   "mb-status--pending",
  cancelled: "mb-status--cancelled",
};

function MyBookings() {
  const [email, setEmail]       = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [searched, setSearched] = useState(false);

  const fetchBookings = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    setSearched(false);
    try {
      const res = await API.get(`/bookings?email=${encodeURIComponent(email)}`);
      setBookings(res.data);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch bookings. Please try again.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") fetchBookings(); };

  return (
    <div className="mb-page">

      {/* Top bar */}
      <header className="mb-topbar">
        <span className="mb-brand">ExpertConnect</span>
        <Link to="/" className="mb-home-link">
          <span className="mb-home-arrow">←</span> Home
        </Link>
      </header>

      <main className="mb-main">

        {/* Page title */}
        <div className="mb-header">
          <h1 className="mb-title">My <span>Bookings</span></h1>
          <p className="mb-subtitle">Enter your email address to view your appointments</p>
        </div>

        {/* Search */}
        <div className="mb-search-box">
          <div className="mb-search-row">
            <div className="mb-input-wrap">
              <span className="mb-input-icon">✉</span>
              <input
                className="mb-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <button
              className="mb-btn"
              onClick={fetchBookings}
              disabled={loading || !email.trim()}
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>

          {error && (
            <div className="mb-error">
              <span>⚠</span> {error}
            </div>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[...Array(3)].map((_, i) => (
              <div className="mb-skeleton" key={i}>
                <div className="mb-skel-avatar" />
                <div className="mb-skel-lines">
                  <div className="mb-skel-line" style={{ width: "45%" }} />
                  <div className="mb-skel-line" style={{ width: "70%" }} />
                  <div className="mb-skel-line" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && searched && bookings.length > 0 && (
          <>
            <div className="mb-results-header">
              <span className="mb-results-label">Appointments</span>
              <span className="mb-results-count">{bookings.length} found</span>
            </div>

            <div className="mb-list">
              {bookings.map((b) => (
                <div className="mb-card" key={b._id}>
                  <div className="mb-avatar">
                    {b.expertId?.name?.[0] || "?"}
                  </div>

                  <div className="mb-card-body">
                    <p className="mb-expert-name">
                      {b.expertId?.name || "Expert"}
                    </p>
                    <div className="mb-card-meta">
                      <span className="mb-meta-item">📅 {b.date}</span>
                      <span className="mb-meta-dot" />
                      <span className="mb-meta-item">🕐 {b.timeSlot}</span>
                    </div>
                  </div>

                  <span className={`mb-status ${STATUS_CLASS[b.status] || "mb-status--default"}`}>
                    {b.status || "unknown"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && searched && bookings.length === 0 && (
          <div className="mb-empty">
            <div className="mb-empty-icon">📭</div>
            <p className="mb-empty-title">No bookings found</p>
            <p className="mb-empty-sub">No appointments associated with this email address</p>
          </div>
        )}

      </main>
    </div>
  );
}

export default MyBookings;