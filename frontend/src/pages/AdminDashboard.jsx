import { useEffect, useState, useRef } from "react"; // Added useRef here
import { useNavigate } from "react-router-dom"; 
import { Trash2, Edit, Users, Check, XCircle, Search, Filter } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate(); 
  const alertShown = useRef(false); // This flag stops the double alert
  
  const [loans, setLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("All");

  // SECURITY & DATA LOADING 
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // SECURITY CHECK
    if (!token) {
      // If we already showed the alert, stop here.
      if (alertShown.current) return; 
      alertShown.current = true; // Mark as shown

      alert("Access Restricted: Only Admins have access to the Dashboard.");
      navigate("/login"); 
    } else {
      // Only fetch data if they are logged in
      fetchLoans(); 
    }
  }, []); 

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8001/loans", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        setLoans(data);
      } else {
        if (response.status === 401) {
            // Prevent double alert here too
            if (!alertShown.current) {
                alertShown.current = true;
                alert("Session expired. Please login again.");
            }
            localStorage.removeItem("token");
            navigate("/login");
        }
        setLoans([]); 
      }
    } catch (error) {
      console.error("Network Error:", error);
      setLoans([]);
    }
  };

  // ACTIONS
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
  };

  const approveLoan = async (id) => {
    await fetch(`http://127.0.0.1:8001/loans/${id}/approve`, { method: "PUT", headers: getAuthHeaders() });
    fetchLoans(); 
  };

  const rejectLoan = async (id) => {
    if (confirm("Are you sure you want to REJECT this loan?")) {
      await fetch(`http://127.0.0.1:8001/loans/${id}/reject`, { method: "PUT", headers: getAuthHeaders() });
      fetchLoans(); 
    }
  };

  const deleteLoan = async (id) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await fetch(`http://127.0.0.1:8001/loans/${id}`, { method: "DELETE", headers: getAuthHeaders() });
      fetchLoans();
    }
  };

  const updateLoan = async (id, currentName, currentAmount, currentPurpose) => {
    const newName = prompt("Edit Name:", currentName);
    if (!newName) return;
    const newAmount = prompt("Edit Amount ($):", currentAmount);
    if (!newAmount) return;
    const newPurpose = prompt("Edit Purpose:", currentPurpose);
    if (!newPurpose) return;

    await fetch(`http://127.0.0.1:8001/loans/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        full_name: newName,
        amount: parseInt(newAmount),
        purpose: newPurpose,
      }),
    });
    fetchLoans();
  };

  // FILTERS
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const currentStatus = loan.status || "Pending"; 
    const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const TabButton = ({ name, label }) => (
    <button
      onClick={() => setStatusFilter(name)}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
        ${statusFilter === name 
          ? "bg-slate-800 text-white shadow-md" 
          : "bg-white text-slate-500 hover:bg-slate-100"}`}
    >
      {label}
    </button>
  );

  // BLANK SCREEN WHILE REDIRECTING
  const token = localStorage.getItem("token");
  if (!token) return null; 

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage loan applications.</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-slate-800">{loans.length}</p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
            <TabButton name="All" label="All Loans" />
            <TabButton name="Pending" label="Pending" />
            <TabButton name="Approved" label="Approved" />
            <TabButton name="Rejected" label="Rejected" />
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search applicants..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4 text-sm font-semibold">S.N.</th>
                <th className="p-4 text-sm font-semibold">Trans. ID</th>
                <th className="p-4 text-sm font-semibold">Name</th>
                <th className="p-4 text-sm font-semibold">Amount</th>
                <th className="p-4 text-sm font-semibold">Purpose</th>
                <th className="p-4 text-sm font-semibold">Status</th>
                <th className="p-4 text-sm font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredLoans.map((loan, index) => (
                <tr key={loan.id} className="hover:bg-blue-50 transition group">
                  <td className="p-4 text-slate-500 font-medium">{index + 1}</td>
                  <td className="p-4 font-mono text-sm text-slate-400">#{8700 + loan.id * 13}</td>
                  <td className="p-4 font-semibold text-slate-700">{loan.full_name}</td>
                  <td className="p-4 font-mono text-slate-600">${loan.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-500 text-sm max-w-xs truncate">{loan.purpose}</td>
                  
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${loan.status === "Approved" ? "bg-green-100 text-green-700 border border-green-200" : 
                        loan.status === "Rejected" ? "bg-red-100 text-red-700 border border-red-200" : 
                        "bg-yellow-100 text-yellow-700 border border-yellow-200"}`}>
                      {loan.status || "Pending"}
                    </span>
                  </td>

                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => updateLoan(loan.id, loan.full_name, loan.amount, loan.purpose)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Edit">
                      <Edit size={18} />
                    </button>
                    {loan.status !== "Approved" && loan.status !== "Rejected" && (
                      <>
                        <button onClick={() => approveLoan(loan.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition shadow-sm" title="Approve">
                          <Check size={18} />
                        </button>
                        <button onClick={() => rejectLoan(loan.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition shadow-sm" title="Reject">
                          <XCircle size={18} />
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteLoan(loan.id)} className="p-2 text-slate-400 hover:bg-red-100 hover:text-red-500 rounded-lg transition" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredLoans.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Filter size={32} className="opacity-20" />
                      <p>No loans found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}