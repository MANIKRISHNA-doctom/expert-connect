import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api.js";
import socket from "../socket.js";
import "../CSS/ExpertDetail.css";

function ExpertDetail() {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const fetchExpert = async () => {
    const res = await API.get(`/experts/${id}`);
    setExpert(res.data);
  };

  const fetchSlots = async () => {
    if (!date) return;
    const res = await API.get(`/experts/${id}/slots?date=${date}`);
    setSlots(res.data.availableSlots);
  };

  useEffect(() => {
    fetchExpert();
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [date]);

  // Real-time update
  useEffect(() => {
    socket.on("slotBooked", (data) => {
      if (data.expertId === id && data.date === date) {
        fetchSlots();
      }
    });
    return () => socket.off("slotBooked");
  }, [date]);

  if (!expert) return <p>Loading...</p>;

  // Split name: first word normal, rest italic gold
  const [firstName, ...rest] = expert.name.split(" ");

  return (
    <div className="ed-page">

      {/* Back nav */}
      <Link to="/" className="ed-back">
        <span className="ed-back-arrow">←</span> All Experts
      </Link>

      {/* Dark hero */}
      <div className="ed-hero">
        <div className="ed-hero-inner">
          <div className="ed-avatar">{expert.name[0]}</div>
          <h2 className="ed-hero-name">
            {firstName}{rest.length > 0 && <> <em>{rest.join(" ")}</em></>}
          </h2>
          <span className="ed-category-badge">{expert.category}</span>
        </div>
      </div>

      {/* Body */}
      <div className="ed-body">

        {/* Date picker */}
        <div className="ed-date-wrap">
          <p className="ed-label">Select a date</p>
          <input
            className="ed-date-input"
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Slots */}
        <div className="ed-slots-wrap">
          <p className="ed-label">Available slots</p>

          {!date && (
            <p className="ed-pick-nudge">Pick a date to see open slots.</p>
          )}

          {date && slots.length > 0 && (
            <div className="ed-slots-grid">
              {slots.map((slot) => (
                <Link
                  key={slot}
                  to={`/book/${id}?date=${date}&slot=${slot}`}
                  className="ed-slot-link"
                >
                  {slot}
                </Link>
              ))}
            </div>
          )}

          {date && slots.length === 0 && (
            <p className="ed-no-slots">No slots available for this date.</p>
          )}
        </div>

        <hr className="ed-divider" />

        <Link to="/" className="ed-home-link">← Home</Link>

      </div>
    </div>
  );
}

export default ExpertDetail;