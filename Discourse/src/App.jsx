// src/App.jsx
import React, {  useState } from "react";
import {Routes,Route,Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import NotAuthorized from "./Routes/NotAuthorized";
import MiniDrawer from "./Drawer/Drawer";
import "bootstrap-icons/font/bootstrap-icons.css";
function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route path="/not-authorized" element={<NotAuthorized />} />

        {/* Wrap MiniDrawer in ProtectedRoutes */}
        <Route
          path="/drawer/*"
          element={
            <ProtectedRoutes
              role={role}
              alloweroles={["admin", "faculty", "student"]}
            >
              <MiniDrawer role={role} />
            </ProtectedRoutes>
          }
        />
        <Route path="*" element={<Navigate to="/not-authorized" replace />} />
      </Routes>
    </div>
  );
}

export default App;
