import { useEffect, useState } from "react";
import API from "../api/api";
import { Link } from "react-router-dom";

function ExpertList() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchExperts = async () => {
    const res = await API.get(`/experts?search=${search}`);
    setExperts(res.data.experts);
    console.log(experts);
  };

  useEffect(() => {
    fetchExperts();
  }, [search]);

  return (
    <div>
      <h2>Experts</h2>

      <input
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {experts.map((exp) => (
        <div key={exp._id}>
          <h3>{exp.name}</h3>
          <p>{exp.category}</p>
          <p>{exp.experience} years</p>
          <Link to={`/expert/${exp._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}

export default ExpertList;