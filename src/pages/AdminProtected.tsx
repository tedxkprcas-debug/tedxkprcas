import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Admin from "./Admin";

const ADMIN_PASSWORD = "KPrcas2024"; // Set your built-in password here

// Helper function to handle logout from anywhere
export const logoutAdmin = () => {
  localStorage.removeItem("adminAuthenticated");
  window.location.href = "/kp-admin-dashboard";
};

const AdminProtected = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if already authenticated in local storage (persists across page navigations)
  useEffect(() => {
    const storedAuth = localStorage.getItem("adminAuthenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuthenticated", "true");
      setPassword("");
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <Admin onLogout={logoutAdmin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-800 to-purple-800 px-6 py-8 text-white">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock size={28} />
              <h1 className="text-2xl">Admin Access</h1>
            </div>
            <p className="text-center text-slate-300 text-sm">Enter your password to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-slate-800 to-purple-800 hover:from-slate-900 hover:to-purple-900 text-white py-2 rounded-lg transition-all"
            >
              Login
            </Button>
          </form>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <p className="text-center text-xs text-slate-500">
              Unauthorized access is prohibited
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProtected;
