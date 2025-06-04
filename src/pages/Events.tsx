
import { useState, useEffect } from "react";
import { eventService, Event } from "@/services/eventService";
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

  // Load events from service
  useEffect(() => {
    const loadedEvents = eventService.getAllEvents();
    setEvents(loadedEvents);
  }, []);

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
