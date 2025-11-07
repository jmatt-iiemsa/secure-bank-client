import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import Logo from '../assets/SecureB.png'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[A-Za-z\s]{2,50}$/.test(formData.fullName)) {
      newErrors.fullName = "Name must be 2-50 letters only";
    }
    
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = "ID number is required";
    } else if (!/^[0-9]{13}$/.test(formData.idNumber)) {
      newErrors.idNumber = "ID must be exactly 13 digits";
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^[0-9]{10,20}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account must be 10-20 digits only";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = "Password must be 8+ chars with uppercase, lowercase, number & symbol";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      const { confirmPassword, ...registerData } = formData;
      console.log("Sending registration data:", registerData);
      const response = await api.post("/auth/register", registerData);
      console.log("Registration success:", response.data);
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
      // Also add immediate redirect as backup
      navigate("/login");
    } catch (err) {
      console.log("Full error object:", err);
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);
      console.log("Error status:", err.response?.status);
      setMessage(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="SecureBank Logo" className="logo" />
          <h2>Create Account</h2>
          <p>Join SecureBank for secure international banking</p>
        </div>
        
        <form onSubmit={handleRegister} className="login-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "error" : ""}
            />
            {errors.fullName && <span className="error-text">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="idNumber">ID Number</label>
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              placeholder="1234567890123"
              value={formData.idNumber}
              onChange={handleChange}
              className={errors.idNumber ? "error" : ""}
              maxLength="13"
              pattern="[0-9]*"
            />
            {errors.idNumber && <span className="error-text">{errors.idNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              id="accountNumber"
              name="accountNumber"
              type="text"
              placeholder="1234567890 (10-20 digits)"
              pattern="[0-9]*"
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
              placeholder="Strong password (8+ chars, A-z, 0-9, @$!%*?&)"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
        
        <div className="login-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}