
export interface Event {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  price: number;
  image: string;
  attendees: number;
  organizer: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: string;
  price: string;
  image: string;
}

class EventService {
  private storageKey = 'evently_events';

  // Get all events
  getAllEvents(): Event[] {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Return default events if none stored
    return this.getDefaultEvents();
  }

  // Get event by ID
  getEventById(id: number): Event | null {
    const events = this.getAllEvents();
    return events.find(event => event.id === id) || null;
  }

  // Create new event
  createEvent(eventData: CreateEventData): Event {
    const events = this.getAllEvents();
    const newEvent: Event = {
      id: Date.now(), // Simple ID generation
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      maxAttendees: parseInt(eventData.maxAttendees) || 100,
      price: parseFloat(eventData.price) || 0,
      image: eventData.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
      attendees: 0,
      organizer: "Current User", // In real app, this would be from auth
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }

  // Update event
  updateEvent(id: number, updates: Partial<Event>): Event | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) return null;
    
    events[eventIndex] = {
      ...events[eventIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveEvents(events);
    return events[eventIndex];
  }

  // Delete event
  deleteEvent(id: number): boolean {
    const events = this.getAllEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length === events.length) return false;
    
    this.saveEvents(filteredEvents);
    return true;
  }

  // Register for event
  registerForEvent(eventId: number): boolean {
    const event = this.getEventById(eventId);
    if (!event || event.attendees >= event.maxAttendees) return false;
    
    this.updateEvent(eventId, { attendees: event.attendees + 1 });
    return true;
  }

  private saveEvents(events: Event[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }

  private getDefaultEvents(): Event[] {
    const defaultEvents = [
      {
        id: 1,
        title: "Tech Conference 2024",
        description: "Join industry leaders for cutting-edge tech insights and networking opportunities",
        date: "March 15, 2024",
        time: "9:00 AM",
        location: "San Francisco, CA",
        attendees: 245,
        maxAttendees: 500,
        price: 299,
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
        category: "Technology",
        organizer: "Tech Events Inc.",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z"
      },
      {
        id: 2,
        title: "Creative Workshop",
        description: "Hands-on creative design workshop for professionals and enthusiasts",
        date: "March 22, 2024",
        time: "2:00 PM",
        location: "New York, NY",
        attendees: 89,
        maxAttendees: 100,
        price: 150,
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
        category: "Workshop",
        organizer: "Creative Studio",
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z"
      },
      {
        id: 3,
        title: "Music Festival",
        description: "Three days of amazing music and entertainment with top artists",
        date: "April 5, 2024",
        time: "6:00 PM",
        location: "Austin, TX",
        attendees: 1200,
        maxAttendees: 5000,
        price: 450,
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
        category: "Music",
        organizer: "Festival Productions",
        createdAt: "2024-01-03T00:00:00.000Z",
        updatedAt: "2024-01-03T00:00:00.000Z"
      }
    ];

    this.saveEvents(defaultEvents);
    return defaultEvents;
  }
}

export const eventService = new EventService();
