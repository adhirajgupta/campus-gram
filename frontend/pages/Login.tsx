import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Invalid email or password. Try seeding the database first if this is your first time.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <div className="max-w-sm mx-auto min-h-screen p-6">
        {/* Header */}
        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-gray-800" style={{ 
            transform: 'rotate(-1deg)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>Login</h1>
        </div>

        {/* Circular Logo Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 border-4 border-dashed border-gray-600 rounded-full flex items-center justify-center bg-white relative"
               style={{ 
                 transform: 'rotate(2deg)',
                 background: 'repeating-linear-gradient(45deg, #f9f9f9, #f9f9f9 2px, #e5e5e5 2px, #e5e5e5 4px)'
               }}>
            <div className="w-12 h-12 border-2 border-gray-500 rounded-full flex items-center justify-center">
              <div className="text-gray-600 text-sm font-bold" style={{ transform: 'rotate(-2deg)' }}>LOGO</div>
            </div>
            {/* X marks with hand-drawn effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-0.5 bg-gray-500 transform rotate-45" style={{ 
                background: 'linear-gradient(90deg, #6b7280 0%, transparent 20%, transparent 80%, #6b7280 100%)'
              }}></div>
              <div className="w-8 h-0.5 bg-gray-500 transform -rotate-45 absolute" style={{ 
                background: 'linear-gradient(90deg, #6b7280 0%, transparent 20%, transparent 80%, #6b7280 100%)'
              }}></div>
            </div>
          </div>
        </div>

        {/* App Title */}
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-gray-800" style={{ 
            transform: 'rotate(1deg)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>CampusConnect</h2>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600" style={{ transform: 'rotate(-0.5deg)' }}>
            Connect with your campus community
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(5deg)' }} />
              <label className="text-lg font-bold text-gray-700" style={{ transform: 'rotate(-1deg)' }}>Email</label>
            </div>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ 
                  transform: 'rotate(0.5deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)',
                  borderImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Cpath d=\'M0,0 L100,0 L100,100 L0,100 Z\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-dasharray=\'5,3\'/%3E%3C/svg%3E") 2'
                }}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lock className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(-3deg)' }} />
              <label className="text-lg font-bold text-gray-700" style={{ transform: 'rotate(1deg)' }}>Password</label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800 pr-12"
                style={{ 
                  transform: 'rotate(-0.5deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                style={{ transform: 'rotate(2deg)' }}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              className="text-base text-gray-600 hover:text-gray-800 underline"
              style={{ transform: 'rotate(1deg)' }}
            >
              Forgot your password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 text-gray-800 font-bold text-xl rounded-lg border-2 border-gray-600 hover:border-gray-800 transition-all relative overflow-hidden"
            style={{ 
              transform: 'rotate(-1deg)',
              background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)',
              boxShadow: '3px 3px 0px rgba(0,0,0,0.2)'
            }}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-0.5 bg-gray-400" style={{
              background: 'repeating-linear-gradient(90deg, #9ca3af 0%, transparent 20%, transparent 80%, #9ca3af 100%)'
            }}></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-gray-50 text-gray-600 text-lg font-bold" style={{ transform: 'rotate(0.5deg)' }}>
              OR SIGN
            </span>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="space-y-4 mb-8">
          <Link to="/register">
            <button className="w-full h-12 text-gray-800 font-bold text-lg rounded-lg border-2 border-gray-600 hover:border-gray-800 relative overflow-hidden"
                    style={{ 
                      transform: 'rotate(1deg)',
                      background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)',
                      boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
                    }}>
              Sign Up
            </button>
          </Link>
          <Link to="/create-university">
            <button className="w-full h-12 text-gray-800 font-bold text-lg rounded-lg border-2 border-gray-600 hover:border-gray-800 relative overflow-hidden"
                    style={{ 
                      transform: 'rotate(-0.5deg)',
                      background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)',
                      boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
                    }}>
              Create University
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}