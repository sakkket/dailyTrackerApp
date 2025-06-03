import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    onLogout();
    navigate("/login");
  }, [onLogout, navigate]);

  return <div>Logging out...</div>;
}
