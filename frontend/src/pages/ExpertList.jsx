import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";
import "../CSS/ExpertList.css";

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchExperts = async () => {
    const res = await API.get(`/experts?search=${search}`);
    setExperts(res.data.experts);
  };

  useEffect(() => {
    fetchExperts();
  }, [search]);

  return (
    <div className="expert-list-page">
      <div className="nav-bar">
        <Link to="/my-bookings">My Bookings</Link>
      </div>

      <h2 className="page-title">Experts</h2>

      <input
        className="search-input"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="expert-grid">
        {experts.map((exp) => (
          <div key={exp._id} className="expert-card">
            <h3 className="expert-name">{exp.name}</h3>
            <p className="expert-meta">{exp.category}</p>
            <p className="expert-meta">{exp.experience} years</p>
            <Link to={`/expert/${exp._id}`} className="view-link">View</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpertList;