import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateUniversity from "./pages/CreateUniversity";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Compose from "./pages/Compose";
import Campus from "./pages/Campus";
import StudyGroups from "./pages/StudyGroups";
import Events from "./pages/Events";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import PostDetail from "./pages/PostDetail";
import Search from "./pages/Search";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
        <Route path="/create-university" element={user ? <Navigate to="/feed" replace /> : <CreateUniversity />} />
        <Route path="/" element={<Navigate to="/feed" replace />} />
        
        <Route element={<Layout />}>
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/u/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/p/:postId" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} />
          <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
          <Route path="/campus" element={<ProtectedRoute><Campus /></ProtectedRoute>} />
          <Route path="/study-groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        </Route>
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
