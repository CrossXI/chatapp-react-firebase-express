import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login"); // or "register"

  return (
    <div style={{
      maxWidth: 400,
      margin: "50px auto",
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    }}>
      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: 16 }}>
        <button
          onClick={() => setActiveTab("login")}
          style={{
            flex: 1,
            padding: 10,
            background: activeTab === "login" ? "#007bff" : "#eee",
            color: activeTab === "login" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("register")}
          style={{
            flex: 1,
            padding: 10,
            background: activeTab === "register" ? "#007bff" : "#eee",
            color: activeTab === "register" ? "#fff" : "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </div>

      {/* Active Form */}
      {activeTab === "login" ? <Login /> : <Register />}
    </div>
  );
}
