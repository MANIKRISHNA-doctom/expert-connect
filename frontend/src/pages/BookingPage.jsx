import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../api/api.js";
import "../CSS/BookingPage.css";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const date = query.get("date");
  const slot = query.get("slot");

  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/bookings", {
        ...form,
        expertId: id,
        date,
        timeSlot: slot,
      });
      navigate(`/expert/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bp-page">
      <div className="bp-card">

        {/* ── Left summary panel ── */}
        <div className="bp-left">
          <Link to={`/expert/${id}`} className="bp-back">
            ← Back to Expert
          </Link>

          <p className="bp-left-eyebrow">Your appointment</p>
          <h2 className="bp-left-title">
            Confirm your <em>booking</em>
          </h2>

          <div className="bp-info-list">
            <div className="bp-info-item">
              <div className="bp-info-icon">📅</div>
              <div className="bp-info-text">
                <span className="bp-info-label">Date</span>
                <span className="bp-info-value">{date || "—"}</span>
              </div>
            </div>
            <div className="bp-info-item">
              <div className="bp-info-icon">🕐</div>
              <div className="bp-info-text">
                <span className="bp-info-label">Time slot</span>
                <span className="bp-info-value">{slot || "—"}</span>
              </div>
            </div>
          </div>

          <p className="bp-left-note">
            Fill in your details and confirm. You'll receive a summary once the booking is placed.
          </p>
        </div>

        {/* ── Right form panel ── */}
        <div className="bp-right">
          <h3 className="bp-form-title">Your details</h3>
          <p className="bp-form-sub">All fields are required except notes.</p>

          {error && (
            <div className="bp-error">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="bp-field">
              <label className="bp-label">Full name</label>
              <input
                className="bp-input"
                placeholder="Jane Doe"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="bp-field">
              <label className="bp-label">Email address</label>
              <input
                className="bp-input"
                type="email"
                placeholder="jane@example.com"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="bp-field">
              <label className="bp-label">Phone number</label>
              <input
                className="bp-input"
                type="tel"
                placeholder="+91 98765 43210"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="bp-field">
              <label className="bp-label">Notes <span style={{ textTransform: 'none', fontWeight: 400, color: '#aaa' }}>(optional)</span></label>
              <textarea
                className="bp-textarea"
                placeholder="Anything you'd like the expert to know..."
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>

            <button className="bp-submit" type="submit" disabled={loading}>
              {loading ? "Booking…" : "Confirm Booking"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default BookingPage;