import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const AssignedTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  let user = localStorage.getItem("user");
  if (user) {
    user = JSON.parse(user);
  }

  const fetchTickets = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/ticket/assinged-tickets`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "GET",
        }
      );
      const data = await res.json();
      setTickets(data.tickets || []);
      console.log(data.tickets);
      console.log(tickets);
      
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
      fetchTickets();
    }, [])

  return (
    <div>
      <Navbar />
      <h1 className="text-center text-3xl my-4">
        Your Assigend Tickets. Please Resolve!
      </h1>
            <div className="p-4 max-w-3xl mx-auto">
      
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  className="card shadow-md p-4 bg-gray-800"
                  to={`/ticket/${ticket._id}`}
                >
                  <h3 className="font-bold text-lg">{ticket.title}</h3>
                  <p className="text-sm">{ticket.description}</p>
                  <p className="text-sm text-gray-500">
                    Created At: {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </Link>
              ))}
              {tickets.length === 0 && <p>No tickets submitted yet.</p>}
            </div>
          </div>
    </div>
  );
};

export default AssignedTickets;
