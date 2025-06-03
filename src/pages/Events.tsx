
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const events = [
    {
      id: 1,
      title: "Tech Conference 2024",
      description: "Join industry leaders for cutting-edge tech insights and networking opportunities",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      attendees: 245,
      maxAttendees: 500,
      price: "$299",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      category: "Technology",
      organizer: "Tech Events Inc."
    },
    {
      id: 2,
      title: "Creative Workshop",
      description: "Hands-on creative design workshop for professionals and enthusiasts",
      date: "March 22, 2024",
      location: "New York, NY",
      attendees: 89,
      maxAttendees: 100,
      price: "$150",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
      category: "Workshop",
      organizer: "Creative Studio"
    },
    {
      id: 3,
      title: "Music Festival",
      description: "Three days of amazing music and entertainment with top artists",
      date: "April 5-7, 2024",
      location: "Austin, TX",
      attendees: 1200,
      maxAttendees: 5000,
      price: "$450",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
      category: "Music",
      organizer: "Festival Productions"
    },
    {
      id: 4,
      title: "Business Summit",
      description: "Network with entrepreneurs and learn from successful business leaders",
      date: "March 28, 2024",
      location: "Chicago, IL",
      attendees: 156,
      maxAttendees: 300,
      price: "$199",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop",
      category: "Business",
      organizer: "Business Network"
    },
    {
      id: 5,
      title: "Art Exhibition",
      description: "Contemporary art exhibition featuring emerging and established artists",
      date: "April 12, 2024",
      location: "Los Angeles, CA",
      attendees: 67,
      maxAttendees: 200,
      price: "$75",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
      category: "Art",
      organizer: "Gallery Modern"
    },
    {
      id: 6,
      title: "Fitness Bootcamp",
      description: "High-intensity fitness bootcamp for all levels with professional trainers",
      date: "March 30, 2024",
      location: "Miami, FL",
      attendees: 34,
      maxAttendees: 50,
      price: "$95",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
      category: "Fitness",
      organizer: "FitLife Academy"
    }
  ];

  const categories = ["all", "Technology", "Workshop", "Music", "Business", "Art", "Fitness"];
  const locations = ["all", "San Francisco, CA", "New York, NY", "Austin, TX", "Chicago, IL", "Los Angeles, CA", "Miami, FL"];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || event.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

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
              <Link to="/events" className="text-blue-600 font-medium">
                Browse Events
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-xl text-gray-600">Find and join amazing events happening around you</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 mb-8 border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filter Events</span>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedLocation("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900 hover:bg-white">
                  {event.category}
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 rounded-lg px-2 py-1">
                  <span className="text-sm font-medium text-gray-900">{event.price}</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
                <CardDescription className="text-gray-600">{event.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4" />
                    {event.attendees} / {event.maxAttendees} attendees
                  </div>
                  <div className="text-sm text-gray-600">
                    Organized by: {event.organizer}
                  </div>
                  
                  {/* Progress bar for capacity */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-gray-500">
                      {Math.round((event.attendees / event.maxAttendees) * 100)}% full
                    </span>
                    <Button className="rounded-xl" asChild>
                      <Link to={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all events</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedLocation("all");
            }}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
