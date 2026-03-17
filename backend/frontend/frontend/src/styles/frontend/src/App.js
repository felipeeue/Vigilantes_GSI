import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import "./styles/main.css";

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  return (
    <div className="App">
      {!user ? (
        <LoginForm onLogin={(userData, role) => { setUser(userData); setRole(role); }} />
      ) : (
        <Dashboard user={user} role={role} logout={() => { setUser(null); setRole(""); }} />
      )}
    </div>
  );
}

export default App;
