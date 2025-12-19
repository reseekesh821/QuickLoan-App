import { useState } from "react";
import { Lock, User, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8001/login", { // Ensure this matches backend URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // SAVE THE TOKEN (This is the critical step)
        localStorage.setItem("token", data.access_token); 
        
        alert("Login Successful! Token Saved. 🔐");
        navigate("/dashboard");
      } else {
        alert("Access Denied! ❌");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Network Error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-4 border-slate-800">
        
        {/* LOGO AREA */}
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}