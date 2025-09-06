import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";
import backend from "~backend/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
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

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await backend.seed.seedData();
      toast({
        title: "Success",
        description: "Database seeded successfully! You can now login with the demo accounts.",
      });
    } catch (error) {
      console.error("Seeding error:", error);
      toast({
        title: "Error",
        description: "Failed to seed database",
        variant: "destructive",
      });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to CampusGram</CardTitle>
          <CardDescription className="text-center">
            Sign in to your university account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="University email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Want to create a university?{" "}
              <Link to="/create-university" className="text-green-600 hover:underline font-medium">
                Create University
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-gray-600 mb-3">
              <p>Stanford Admin: admin@stanford.edu / password123</p>
              <p>Berkeley Admin: admin@berkeley.edu / password123</p>
              <p>Student: alice0@stanford.edu / password123</p>
            </div>
            <Button 
              onClick={handleSeedDatabase}
              disabled={seeding}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {seeding ? "Seeding Database..." : "Seed Database (First Time Setup)"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
