import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/SecureB.png"
export default function LoginPage() {
  const [formData, setFormData] = useState({
    accountNumber: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (formData.accountNumber.length < 8) {
      newErrors.accountNumber = "Account number must be at least 8 characters";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      console.log("Attempting login with:", formData);
      const res = await api.post("/auth/login", formData);
      console.log("Login response:", res.data);
      localStorage.setItem("token", res.data.token);
      console.log("Token stored, redirecting to dashboard");
      window.location.replace("/dashboard");
    } catch (err) {
      console.log("Login error:", err.response?.data);
      setMessage(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="SecureBank Logo" className="logo" />
          <h2>Welcome Back</h2>
          <p>Please sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              placeholder="Enter your account number"
              value={formData.accountNumber}
              onChange={handleChange}
              className={errors.accountNumber ? "error" : ""}
            />
            {errors.accountNumber && <span className="error-text">{errors.accountNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        {message && <div className="message error">{message}</div>}
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link></p>
          <p>Secure banking with end-to-end encryption</p>
        </div>
      </div>
    </div>
  );
}
