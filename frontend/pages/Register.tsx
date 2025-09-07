import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, User, GraduationCap, BookOpen, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    year: "",
    major: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        year: formData.year ? parseInt(formData.year) : undefined,
        major: formData.major || undefined,
      });
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to create account. Please check your university email domain.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'MTF Jude, cursive' }}>
      <div className="max-w-sm mx-auto min-h-screen p-6">
        {/* Header */}
        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-gray-800" style={{ 
            transform: 'rotate(-1deg)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>Sign Up</h1>
        </div>

        {/* App Title */}
        <div className="text-center mb-2">
          <h2 className="text-3xl font-bold text-gray-800" style={{ 
            transform: 'rotate(1deg)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>Join CampusConnect</h2>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600" style={{ transform: 'rotate(-0.5deg)' }}>
            Create your university account
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(5deg)' }} />
              <label className="text-lg font-bold text-gray-700" style={{ transform: 'rotate(-1deg)' }}>University Email</label>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="your.email@university.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ 
                  transform: 'rotate(0.5deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
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
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
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

          {/* Full Name Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(3deg)' }} />
              <label className="text-lg font-bold text-gray-700" style={{ transform: 'rotate(-0.5deg)' }}>Full Name</label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="e.g., John Doe"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ 
                  transform: 'rotate(0.3deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
                required
              />
            </div>
          </div>

          {/* Year Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(-2deg)' }} />
              <label className="text-lg font-bold text-gray-700" style={{ transform: 'rotate(0.5deg)' }}>Year</label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="year"
                placeholder="1, 2, 3, or 4"
                value={formData.year}
                onChange={handleChange}
                min="1"
                max="4"
                className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ 
                  transform: 'rotate(-0.2deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
              />
            </div>
          </div>

          {/* Major Field */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-600" style={{ transform: 'rotate(4deg)' }} />
              <label className="text-lg font-bold text-gray-700" style={{ transform: 'rotate(-0.3deg)' }}>Major</label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="major"
                placeholder="e.g., Computer Science"
                value={formData.major}
                onChange={handleChange}
                className="w-full h-12 px-4 text-lg border-2 border-gray-600 rounded-lg bg-white focus:outline-none focus:border-gray-800"
                style={{ 
                  transform: 'rotate(0.1deg)',
                  background: 'repeating-linear-gradient(45deg, #ffffff, #ffffff 2px, #f9f9f9 2px, #f9f9f9 4px)'
                }}
              />
            </div>
          </div>

          {/* Sign Up Button */}
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
            {loading ? "Creating Account..." : "Sign Up"}
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
              OR
            </span>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="space-y-4 mb-8">
          <Link to="/login">
            <button className="w-full h-12 text-gray-800 font-bold text-lg rounded-lg border-2 border-gray-600 hover:border-gray-800 relative overflow-hidden"
                    style={{ 
                      transform: 'rotate(1deg)',
                      background: 'repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 2px, #d1d5db 2px, #d1d5db 4px)',
                      boxShadow: '2px 2px 0px rgba(0,0,0,0.2)'
                    }}>
              Sign In
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

        {/* Info Box */}
        
      </div>
    </div>
  );
}