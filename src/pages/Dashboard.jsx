import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [accountInfo, setAccountInfo] = useState({
    balance: "R 25,430.50",
    accountNumber: "****1234",
    accountType: "Current Account"
  });

  useEffect(() => {
    fetchTransactions();
    getUserName();
  }, []);

  const getUserName = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.name || "User");
      } catch (err) {
        setUserName("User");
      }
    }
  };

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      // Mock data since we don't have a transactions endpoint
      const mockTransactions = [
        {
          id: 1,
          date: "2024-01-15",
          description: "International Transfer to USD Account",
          amount: -2500.00,
          currency: "ZAR",
          status: "Completed",
          type: "outgoing"
        },
        {
          id: 2,
          date: "2024-01-14",
          description: "Salary Deposit",
          amount: 15000.00,
          currency: "ZAR",
          status: "Completed",
          type: "incoming"
        },
        {
          id: 3,
          date: "2024-01-12",
          description: "International Transfer to EUR Account",
          amount: -1200.00,
          currency: "ZAR",
          status: "Pending",
          type: "outgoing"
        },
        {
          id: 4,
          date: "2024-01-10",
          description: "Investment Return",
          amount: 3500.00,
          currency: "ZAR",
          status: "Completed",
          type: "incoming"
        }
      ];
      
      setTransactions(mockTransactions);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch transactions");
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency) => {
    const sign = amount >= 0 ? "+" : "";
    return `${sign}${currency} ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Good day, <span className="user-name">{userName}</span>!</h1>
        <p>Here's an overview of your account activity and recent transactions</p>
      </div>

      <div className="account-summary">
        <div className="account-card">
          <h3>Account Summary</h3>
          <div className="account-details">
            <div className="balance">
              <span className="label">
                <i className="fas fa-wallet"></i>
                Available Balance
              </span>
              <span className="amount">{accountInfo.balance}</span>
            </div>
            <div className="account-info">
              <span className="label">
                <i className="fas fa-hashtag"></i>
                Account Number
              </span>
              <span className="value">{accountInfo.accountNumber}</span>
            </div>
            <div className="account-info">
              <span className="label">
                <i className="fas fa-university"></i>
                Account Type
              </span>
              <span className="value">{accountInfo.accountType}</span>
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
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
              <div className="transaction-info">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
              </div>
              <div className="transaction-details">
                <div className={`transaction-amount ${transaction.type}`}>
                  {formatAmount(transaction.amount, transaction.currency)}
                </div>
                <div className={`transaction-status ${transaction.status.toLowerCase()}`}>
                  {transaction.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}