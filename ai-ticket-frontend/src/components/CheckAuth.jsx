import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckAuth = ({ children, protected: isProtected }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isProtected) {
      if (!token) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    } else {
      if (token) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return children;
  }
};


export default CheckAuth;
