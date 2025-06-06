
import { useState } from "react";
import { Calendar, Users, BarChart3, Ticket, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/services/authService";
import MyTickets from "@/components/tickets/MyTickets";
import EventAnalytics from "@/components/analytics/EventAnalytics";

const Dashboard = () => {
  const [user] = useState(authService.getCurrentUser());
  const navigate = useNavigate();

  const handleSignOut = () => {
    authService.logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">Please sign in to access your dashboard.</p>
            <div className="flex space-x-3">
              <Button asChild className="flex-1">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Evently</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                Browse Events
              </Link>
              {user.role === 'organizer' && (
                <Link to="/create-event" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Create Event
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.firstName}! ({user.role})
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Manage your events, tickets, and view analytics</p>
        </div>

        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets" className="flex items-center">
              <Ticket className="h-4 w-4 mr-2" />
              My Tickets
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              My Events
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="mt-6">
            <MyTickets />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {user.role === 'organizer' ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events created yet</h3>
                <p className="text-gray-600 mb-4">Start creating amazing events for your community!</p>
                <Button asChild>
                  <Link to="/create-event">
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendee View</h3>
                <p className="text-gray-600 mb-4">As an attendee, you can browse and book events</p>
                <Button asChild>
                  <Link to="/events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Events
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <EventAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
