import { Link, useNavigate } from "react-router-dom";
import { 
  Home, 
  Search, 
  PlusCircle, 
  MapPin, 
  Users, 
  Calendar, 
  Settings, 
  Shield,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/feed" className="text-xl font-bold text-blue-600">
            CampusGram
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/feed">
              <Button variant="ghost" size="sm">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/compose">
              <Button variant="ghost" size="sm">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/campus">
              <Button variant="ghost" size="sm">
                <MapPin className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/study-groups">
              <Button variant="ghost" size="sm">
                <Users className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="ghost" size="sm">
                <Calendar className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            {user.isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <Shield className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
