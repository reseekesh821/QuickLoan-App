import { Link } from "react-router-dom";
import { DollarSign, LayoutDashboard, Home } from "lucide-react"; // Real Icons

export default function Navbar() {
  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 hover:text-green-400 transition">
          <div className="bg-green-500 p-1.5 rounded-lg text-slate-900">
            <DollarSign size={24} strokeWidth={3} />
          </div>
          <span className="text-xl font-bold tracking-wide">QuickLoan</span>
        </Link>

        {/* Links Section */}
        <div className="flex gap-6">
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <Home size={18} />
            <span className="font-medium">Home</span>
          </Link>
          
          <Link to="/dashboard" className="flex items-center gap-2 text-slate-300 hover:text-white transition">
            <LayoutDashboard size={18} />
            <span className="font-medium">Dashboard</span>
          </Link>
        </div>

      </div>
    </nav>
  );
}