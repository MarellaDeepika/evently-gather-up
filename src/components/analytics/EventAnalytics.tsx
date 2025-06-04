
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, DollarSign, Star, TrendingUp, Calendar, MapPin } from "lucide-react";
import { eventService } from "@/services/eventService";
import { ticketService } from "@/services/ticketService";

interface AnalyticsData {
  totalEvents: number;
  totalRevenue: number;
  totalAttendees: number;
  averageRating: number;
  revenueByMonth: any[];
  eventsByCategory: any[];
  attendeesByEvent: any[];
  feedbackData: any[];
}

const EventAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalEvents: 0,
    totalRevenue: 0,
    totalAttendees: 0,
    averageRating: 0,
    revenueByMonth: [],
    eventsByCategory: [],
    attendeesByEvent: [],
    feedbackData: []
  });

  useEffect(() => {
    const events = eventService.getAllEvents();
    const tickets = ticketService.getAllTickets();
    const feedback = JSON.parse(localStorage.getItem('event_feedback') || '[]');

    // Calculate basic metrics
    const totalEvents = events.length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
    const averageRating = feedback.length > 0 
      ? feedback.reduce((sum: number, fb: any) => sum + fb.rating, 0) / feedback.length 
      : 0;

    // Revenue by month (simulated)
    const revenueByMonth = [
      { month: 'Jan', revenue: 2400 },
      { month: 'Feb', revenue: 1398 },
      { month: 'Mar', revenue: 9800 },
      { month: 'Apr', revenue: 3908 },
      { month: 'May', revenue: 4800 },
      { month: 'Jun', revenue: 3800 }
    ];

    // Events by category
    const categoryCount: { [key: string]: number } = {};
    events.forEach(event => {
      categoryCount[event.category] = (categoryCount[event.category] || 0) + 1;
    });
    const eventsByCategory = Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count
    }));

    // Attendees by event
    const attendeesByEvent = events.map(event => ({
      name: event.title.substring(0, 20) + (event.title.length > 20 ? '...' : ''),
      attendees: event.attendees,
      capacity: event.maxAttendees
    }));

    setAnalytics({
      totalEvents,
      totalRevenue,
      totalAttendees,
      averageRating,
      revenueByMonth,
      eventsByCategory,
      attendeesByEvent,
      feedbackData: feedback
    });
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Event Analytics</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalEvents}</div>
            <p className="text-xs text-muted-foreground">Active events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From ticket sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Registered attendees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">From {analytics.feedbackData.length} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.eventsByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, count }) => `${category}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.eventsByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Event</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.attendeesByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendees" fill="#8884d8" />
                  <Bar dataKey="capacity" fill="#82ca9d" opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.feedbackData.slice(0, 5).map((feedback: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${star <= feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <Badge variant="outline">{feedback.rating}/5</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{feedback.feedback}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(feedback.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {analytics.feedbackData.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No feedback available yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventAnalytics;
