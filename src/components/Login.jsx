import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Hardcoded credentials
const USERNAME = "abhishek";
const PASSWORD = "Abhishek@571";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate quick check
    setTimeout(() => {
      if (username === USERNAME && password === PASSWORD) {
        localStorage.setItem("auth", "1");
        if (typeof onLogin === "function") onLogin();
        navigate("/", { replace: true });
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign in</h1>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border-gray-300 py-2 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              autoComplete="username"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-gray-300 py-2 px-4 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              autoComplete="current-password"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
      
        </form>
      </div>
    </div>
  );
};

export default Login;
