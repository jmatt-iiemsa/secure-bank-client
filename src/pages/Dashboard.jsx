import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [accountInfo, setAccountInfo] = useState({
    balance: "",
    accountNumber: "",
    accountType: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in again.");
          setLoading(false);
          return;
        }

        // Get user info from JWT token
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserName(payload.name || "User");
        
        // Get account details and payments from API
        const [accountResponse, paymentsResponse] = await Promise.all([
          api.get("/accounts/details"),
          api.get("/payments")
        ]);
        
        setAccountInfo(accountResponse.data);
        setTransactions(paymentsResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Good day, <span className="user-name">{userName}</span>!</h1>
        <p>Here's an overview of your account activity and recent transactions</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="account-summary">
        <div className="account-card">
          <h3>Account Summary</h3>
          <div className="account-details">
            <div className="balance">
              <span className="label">
                <i className="fas fa-wallet"></i>
                Available Balance
              </span>
              <span className="amount">
                {accountInfo.balance ? `R ${accountInfo.balance}` : "Loading..."}
              </span>
            </div>
            <div className="account-info">
              <span className="label">
                <i className="fas fa-hashtag"></i>
                Account Number
              </span>
              <span className="value">
                {accountInfo.accountNumber || (loading ? "Loading..." : "Not Available")}
              </span>
            </div>
            <div className="account-info">
              <span className="label">
                <i className="fas fa-university"></i>
                Account Type
              </span>
              <span className="value">
                {accountInfo.accountType || (loading ? "Loading..." : "Not Available")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="transactions-section">
        <div className="section-header">
          <i className="fas fa-cash-register"></i>
          <h3 className="transaction_head">Recent Transactions</h3>
          <span className="transaction-count">{transactions.length} transactions</span>
        </div>

        <div className="transactions-list">
          {transactions.length === 0 ? (
            <div className="no-transactions">No transactions found.</div>
          ) : (
            transactions.map((payment) => {
              const status = payment.submittedToSwift ? "Completed" : payment.verified ? "Verified" : "Pending";
              const description = `Payment to ${payment.recipientAccount} via ${payment.provider}`;
              
              return (
                <div
                  key={payment._id}
                  className={`transaction-item outgoing`}
                >
                  <div className="transaction-info">
                    <div className="transaction-description">
                      {description}
                    </div>
                    <div className="transaction-date">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="transaction-details">
                    <div className="transaction-amount outgoing">
                      -{payment.currency} {Number(payment.amount).toLocaleString("en-ZA", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`transaction-status ${status.toLowerCase()}`}
                    >
                      {status}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}