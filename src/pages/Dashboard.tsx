
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Users, BarChart3, Plus, Edit, Trash2, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { label: "Total Events", value: "12", icon: Calendar, color: "text-blue-600" },
    { label: "Total Attendees", value: "2,847", icon: Users, color: "text-green-600" },
    { label: "Revenue", value: "$45,230", icon: BarChart3, color: "text-purple-600" },
    { label: "Active Events", value: "5", icon: Eye, color: "text-orange-600" }
  ];

  const myEvents = [
    {
      id: 1,
      title: "Tech Conference 2024",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      attendees: 245,
      maxAttendees: 500,
      revenue: "$12,250",
      status: "Active",
      category: "Technology"
    },
    {
      id: 2,
      title: "Creative Workshop",
      date: "March 22, 2024",
      location: "New York, NY",
      attendees: 89,
      maxAttendees: 100,
      revenue: "$4,450",
      status: "Active",
      category: "Workshop"
    },
    {
      id: 3,
      title: "Business Summit",
      date: "February 28, 2024",
      location: "Chicago, IL",
      attendees: 156,
      maxAttendees: 300,
      revenue: "$8,780",
      status: "Completed",
      category: "Business"
    },
    {
      id: 4,
      title: "Art Exhibition",
      date: "April 12, 2024",
      location: "Los Angeles, CA",
      attendees: 67,
      maxAttendees: 200,
      revenue: "$3,350",
      status: "Draft",
      category: "Art"
    }
  ];

  const recentRegistrations = [
    { name: "John Doe", event: "Tech Conference 2024", date: "2 hours ago", avatar: "JD" },
    { name: "Sarah Wilson", event: "Creative Workshop", date: "4 hours ago", avatar: "SW" },
    { name: "Mike Johnson", event: "Tech Conference 2024", date: "6 hours ago", avatar: "MJ" },
    { name: "Emily Chen", event: "Art Exhibition", date: "1 day ago", avatar: "EC" },
    { name: "David Brown", event: "Creative Workshop", date: "1 day ago", avatar: "DB" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Completed": return "bg-gray-100 text-gray-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
              <Link to="/dashboard" className="text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link to="/create-event" className="text-gray-700 hover:text-blue-600 transition-colors">
                Create Event
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-xl text-gray-600">Manage your events and track performance</p>
          </div>
          <Button className="rounded-xl" asChild>
            <Link to="/create-event">
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">My Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Events */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>Your latest event activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.date}
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Registrations */}
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                  <CardDescription>Latest attendee sign-ups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRegistrations.map((registration, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{registration.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{registration.name}</p>
                          <p className="text-sm text-gray-600">{registration.event}</p>
                        </div>
                        <span className="text-sm text-gray-500">{registration.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card className="border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>My Events</CardTitle>
                <CardDescription>Manage all your events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="h-4 w-4 mr-2" />
                              {event.attendees} / {event.maxAttendees}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <BarChart3 className="h-4 w-4 mr-2" />
                              {event.revenue}
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                  <CardDescription>Track your events' success metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Average Attendance Rate</span>
                        <span className="text-sm font-bold text-gray-900">74%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "74%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Registration Completion</span>
                        <span className="text-sm font-bold text-gray-900">89%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Revenue Growth</span>
                        <span className="text-sm font-bold text-gray-900">+23%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "23%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trends over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {[12000, 15000, 18000, 22000, 19000, 25000].map((amount, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-blue-600 rounded-t-md transition-all duration-500 hover:bg-blue-700"
                          style={{ height: `${(amount / 25000) * 200}px` }}
                        ></div>
                        <span className="text-xs text-gray-600 mt-2">
                          {["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][index]}
                        </span>
                        <span className="text-xs font-medium text-gray-900">
                          ${(amount / 1000).toFixed(0)}k
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
