import { useState } from "react";
import { Send, User, DollarSign, FileText } from "lucide-react"; // Icons

export default function LoanApplication() {
  const [formData, setFormData] = useState({
    full_name: "",
    amount: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Changed URL to ends with "/apply" to match Python code
      const response = await fetch("http://127.0.0.1:8001/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Application Submitted Successfully! 🚀");
        setFormData({ full_name: "", amount: "", purpose: "" }); // Clear form
      } else {
        const errorData = await response.json();
        alert("Server Error: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network Error! Is the backend running?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Apply for a Loan</h2>
          <p className="text-slate-400">Fast approval. Low interest rates.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <User size={16} className="text-blue-500"/> Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="e.g. John Doe"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <DollarSign size={16} className="text-green-500"/> Loan Amount ($)
            </label>
            <input
              type="number"
              name="amount"
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>

          {/* Purpose Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText size={16} className="text-purple-500"/> Purpose
            </label>
            <textarea
              name="purpose"
              placeholder="Why do you need this loan?"
              value={formData.purpose}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition resize-none"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex justify-center items-center gap-2"
          >
            <Send size={20} /> Submit Application
          </button>

        </form>
      </div>
    </div>
  );
}