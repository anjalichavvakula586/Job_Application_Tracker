import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
const API_URL = import.meta.env.VITE_API_URL;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Could not reach the server. Is the backend running?");
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="auth-title">Sign Up</h1>
        <p className="auth-subtitle">Create your CareerHero account</p>

        {error && <div className="auth-error">{error}</div>}
        {success && (
          <div className="auth-error" style={{ background: "#e3f7e8", color: "#1f8f3f" }}>
            Account created! Redirecting to login...
          </div>
        )}

        <div className="auth-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="auth-btn">
          Sign Up
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;