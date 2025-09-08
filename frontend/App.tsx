import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UniversityOnboarding from "./pages/UniversityOnboarding";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Compose from "./pages/Compose";
import Campus from "./pages/Campus";
import StudyGroups from "./pages/StudyGroups";
import StudyGroupDetail from "./pages/StudyGroupDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import PostDetail from "./pages/PostDetail";
import Search from "./pages/Search";
import FontDemo from "./pages/FontDemo";
import PluginMarketplace from "./pages/PluginMarketplace";
import Layout from "./components/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-primary">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-800 mb-4 font-secondary" style={{ 
            transform: 'rotate(-2deg)',
            textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
          }}>
            Campus
          </div>
          <div className="text-4xl font-bold text-blue-600 font-secondary" style={{ 
            transform: 'rotate(1deg)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>
            Gram
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white font-primary">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-800 mb-4 font-secondary" style={{ 
            transform: 'rotate(-2deg)',
            textShadow: '3px 3px 0px rgba(0,0,0,0.1)'
          }}>
            Campus
          </div>
          <div className="text-4xl font-bold text-blue-600 font-secondary" style={{ 
            transform: 'rotate(1deg)',
            textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
          }}>
            Gram
          </div>
        </div>
      </div>
    );
  }
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/feed" replace />;
  }
  
  return <>{children}</>;
}

function AppInner() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/feed" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/feed" replace /> : <Register />} />
        <Route path="/create-university" element={user ? <Navigate to="/feed" replace /> : <UniversityOnboarding />} />
        <Route path="/" element={<Navigate to="/feed" replace />} />
        
        <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="/event/:eventId" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
        <Route path="/u/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/p/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
        <Route path="/campus" element={<ProtectedRoute><Campus /></ProtectedRoute>} />
        <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
        <Route path="/study-group/:groupId" element={<ProtectedRoute><StudyGroupDetail /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/plugin-marketplace" element={<ProtectedRoute><PluginMarketplace /></ProtectedRoute>} />
        <Route path="/font-demo" element={<ProtectedRoute><FontDemo /></ProtectedRoute>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </QueryClientProvider>
  );
}
