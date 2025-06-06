
import { useState, useEffect } from "react";
import { eventService, Event } from "@/services/eventService";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EventsNavigation from "@/components/events/EventsNavigation";
import EventsHeader from "@/components/events/EventsHeader";
import EventsFilters from "@/components/events/EventsFilters";
import EventsGrid from "@/components/events/EventsGrid";
import EmptyEventsState from "@/components/events/EmptyEventsState";

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState(authService.getCurrentUser());

  // Check authentication - redirect if not logged in
  useEffect(() => {
    if (!user) {
      // Don't show anything if user is not authenticated
      return;
    }
  }, [user]);

  // Load events from service only if user is authenticated
  useEffect(() => {
    if (user) {
      const loadedEvents = eventService.getAllEvents();
      setEvents(loadedEvents);
      console.log('Loaded events:', loadedEvents);
    }
  }, [user]);

  // Listen for auth changes
  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  // If user is not logged in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <EventsNavigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Sign In Required
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Please sign in to view and book events
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = ["all", "Technology", "Workshop", "Music", "Business", "Art", "Fitness", "Food", "Sports", "Education"];
  
  // Extract unique locations from events
  const locations = ["all", ...Array.from(new Set(events.map(event => event.location)))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesLocation = selectedLocation === "all" || event.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedLocation("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <EventsNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventsHeader />

        <div className="mb-6 p-4 bg-white/80 backdrop-blur rounded-lg border">
          <p className="text-sm text-gray-600">
            Welcome back, <span className="font-medium">{user.firstName} {user.lastName}</span>! 
            You can now register for events and receive booking confirmations.
          </p>
        </div>

        <EventsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          categories={categories}
          locations={locations}
        />

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {filteredEvents.length > 0 ? (
          <EventsGrid events={filteredEvents} />
        ) : (
          <EmptyEventsState onClearFilters={clearAllFilters} />
        )}
      </div>
    </div>
  );
};

export default Events;
