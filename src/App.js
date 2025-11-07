import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loginpage from "./pages/Loginpage";
import Registerpage from "./pages/Registerpage";
import Dashboard from "./pages/Dashboard";
import Paymentpage from "./pages/Paymentpage";
import Navbar from "./components/Navbar";
import "./App.css";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(localStorage.getItem("token"));
  const location = useLocation();
  
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(token);
  }, []);

  const showSidebar = isAuthenticated && (location.pathname === '/dashboard' || location.pathname === '/payment');

  return (
    <div className="app">
      {showSidebar && <Navbar />}
      <main className={showSidebar ? "main-content" : "main-content-full"}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<Registerpage />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/payment" element={isAuthenticated ? <Paymentpage /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
