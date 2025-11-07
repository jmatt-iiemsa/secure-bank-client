import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Money from "../assets/money.png";

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    provider: "SWIFT",
    swiftCode: "",
    payeeAccount: "",
    payeeName: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const currencies = [
    { code: "USD", name: "US Dollar", rate: 18.50 },
    { code: "EUR", name: "Euro", rate: 20.15 },
    { code: "GBP", name: "British Pound", rate: 23.40 },
    { code: "JPY", name: "Japanese Yen", rate: 0.12 },
    { code: "AUD", name: "Australian Dollar", rate: 12.30 }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    } else if (parseFloat(formData.amount) > 100000) {
      newErrors.amount = "Amount cannot exceed R100,000 per transaction";
    }
    
    if (!formData.payeeName.trim()) {
      newErrors.payeeName = "Payee name is required";
    }
    
    if (!formData.payeeAccount.trim()) {
      newErrors.payeeAccount = "Payee account number is required";
    } else if (formData.payeeAccount.length < 8) {
      newErrors.payeeAccount = "Account number must be at least 8 characters";
    }
    
    if (!formData.swiftCode.trim()) {
      newErrors.swiftCode = "SWIFT code is required";
    } else if (!/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(formData.swiftCode.toUpperCase())) {
      newErrors.swiftCode = "Please enter a valid SWIFT code (e.g., ABNANL2A)";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Payment description is required";
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

  const calculateZARAmount = () => {
    const selectedCurrency = currencies.find(c => c.code === formData.currency);
    if (formData.amount && selectedCurrency) {
      return (parseFloat(formData.amount) * selectedCurrency.rate).toFixed(2);
    }
    return "0.00";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage("");
    
    try {
      const token = localStorage.getItem("token");
      const paymentData = {
        amount: formData.amount,
        currency: formData.currency,
        provider: formData.provider,
        recipientAccount: formData.payeeAccount,
        swiftCode: formData.swiftCode.toUpperCase()
      };
      
      const res = await api.post("/payments", paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setSuccess(true);
      setMessage(`Payment of ${formData.currency} ${formData.amount} (R${calculateZARAmount()}) has been submitted successfully!`);
      
      // Reset form after successful payment
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="payment-success">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Payment Submitted Successfully!</h2>
          <p>{message}</p>
          <p>You will be redirected to your dashboard shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="payment-header">
          <img src={Money} alt="Payment" className="payment-image" />
          <h1>International Payment</h1>
          <p>Send money securely worldwide</p>
        </div>
        
        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Amount</label>
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={errors.amount ? "error" : ""}
              />
              {errors.amount && <span className="error-text">{errors.amount}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                {currencies.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {formData.amount && (
            <div className="conversion-info">
              <p>Equivalent: <strong>R{calculateZARAmount()}</strong> (Rate: R{currencies.find(c => c.code === formData.currency)?.rate})</p>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="payeeName">Payee Name</label>
            <input
              id="payeeName"
              name="payeeName"
              type="text"
              placeholder="Full name of recipient"
              value={formData.payeeName}
              onChange={handleChange}
              className={errors.payeeName ? "error" : ""}
            />
            {errors.payeeName && <span className="error-text">{errors.payeeName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="payeeAccount">Payee Account Number</label>
            <input
              id="payeeAccount"
              name="payeeAccount"
              type="text"
              placeholder="Recipient's account number"
              value={formData.payeeAccount}
              onChange={handleChange}
              className={errors.payeeAccount ? "error" : ""}
            />
            {errors.payeeAccount && <span className="error-text">{errors.payeeAccount}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="swiftCode">SWIFT Code</label>
              <input
                id="swiftCode"
                name="swiftCode"
                type="text"
                placeholder="e.g., ABNANL2A"
                value={formData.swiftCode}
                onChange={handleChange}
                className={errors.swiftCode ? "error" : ""}
                style={{ textTransform: 'uppercase' }}
              />
              {errors.swiftCode && <span className="error-text">{errors.swiftCode}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="provider">Provider</label>
              <select
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
              >
                <option value="SWIFT">SWIFT Network</option>
                <option value="CORRESPONDENT">Correspondent Banking</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Payment Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Purpose of payment (required for compliance)"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              rows="3"
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>
          
          <button type="submit" className="payment-btn" disabled={loading}>
            {loading ? "Processing Payment..." : "Send Payment"}
          </button>
        </form>
        
        {message && !success && <div className="message error_1">{message}</div>}
        
        <div className="payment-footer">
          <p>🔒 All payments are secured with bank-level encryption</p>
        </div>
      </div>
    </div>
  );
}
