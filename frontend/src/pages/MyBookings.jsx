import { useState } from "react";
import API from "../api/api";

function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const res = await API.get(`/bookings?email=${email}`);
    setBookings(res.data);
  };

  return (
    <div>
      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={fetchBookings}>Get Bookings</button>

      {bookings.map((b) => (
        <div key={b._id}>
          <p>{b.expertId?.name}</p>
          <p>{b.date} - {b.timeSlot}</p>
          <p>Status: {b.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyBookings;