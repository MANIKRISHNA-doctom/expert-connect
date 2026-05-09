import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/api";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const query = new URLSearchParams(useLocation().search);
  const date = query.get("date");
  const slot = query.get("slot");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/bookings", {
        ...form,
        expertId: id,
        date,
        timeSlot: slot,
      });

      alert("Booking successful!");

      //  Redirect back to expert detail page
      navigate(`/expert/${id}`);

    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Booking for {date} at {slot}</h3>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Phone"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />

      <textarea
        placeholder="Notes"
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button type="submit">Book</button>
    </form>
  );
}

export default BookingPage;