import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import socket from "../socket";

function ExpertDetail() {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const fetchExpert = async () => {
    const res = await API.get(`/experts/${id}`);
    setExpert(res.data.expert);
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

  //  Real-time update
  useEffect(() => {
    socket.on("slotBooked", (data) => {
      if (data.expertId === id && data.date === date) {
        fetchSlots();
      }
    });

    return () => socket.off("slotBooked");
  }, [date]);

  if (!expert) return <p>Loading...</p>;

  return (
    <div>
      <h2>{expert.name}</h2>
      <p>{expert.category}</p>

      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <h3>Available Slots</h3>
      {slots.map((slot) => (
        <div key={slot}>
          <Link to={`/book/${id}?date=${date}&slot=${slot}`}>
            {slot}
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ExpertDetail;