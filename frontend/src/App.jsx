import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoanApplication from "./pages/LoanApplication"; // We point to EXISTING file here
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <Routes>
        {/* When user goes to "/", show your LoanApplication form */}
        <Route path="/" element={<LoanApplication />} /> 
        
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
