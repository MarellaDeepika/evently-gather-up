export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  maxAttendees: number;
  attendees: number;
  image: string;
  organizer: string;
  organizerId: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  maxAttendees: number;
  image: string;
}

class EventService {
  private eventsKey = 'evently_events';

  constructor() {
    this.initializeEvents();
  }

  private initializeEvents() {
    const existing = localStorage.getItem(this.eventsKey);
    if (!existing) {
      const sampleEvents: Event[] = [
        {
          id: 1,
          title: "Tech Conference 2024",
          description: "Join industry leaders for cutting-edge tech insights and networking opportunities. Learn about the latest trends in AI, blockchain, and cloud computing.",
          date: "March 15, 2024",
          time: "9:00 AM",
          location: "San Francisco, CA",
          category: "Technology",
          price: 299,
          maxAttendees: 500,
          attendees: 245,
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
          organizer: "Tech Corp",
          organizerId: 1
        },
        {
          id: 2,
          title: "Creative Workshop",
          description: "Hands-on creative design workshop for professionals. Enhance your skills in graphic design, photography, and digital art.",
          date: "March 22, 2024",
          time: "10:00 AM",
          location: "New York, NY",
          category: "Workshop",
          price: 150,
          maxAttendees: 100,
          attendees: 89,
          image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
          organizer: "Design Studio",
          organizerId: 2
        },
        {
          id: 3,
          title: "Music Festival",
          description: "Three days of amazing music and entertainment. Featuring top artists from around the world.",
          date: "April 5-7, 2024",
          time: "6:00 PM",
          location: "Austin, TX",
          category: "Music",
          price: 450,
          maxAttendees: 2000,
          attendees: 1200,
          image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
          organizer: "Music Fest Inc",
          organizerId: 3
        },
        {
          id: 4,
          title: "Business Conference",
          description: "The premier event for business leaders and entrepreneurs. Network with industry experts and gain valuable insights.",
          date: "April 12, 2024",
          time: "8:30 AM",
          location: "Chicago, IL",
          category: "Business",
          price: 399,
          maxAttendees: 300,
          attendees: 210,
          image: "https://images.unsplash.com/photo-1507883245204-4b65e7000ffd?w=800&h=400&fit=crop",
          organizer: "Biz Summit",
          organizerId: 4
        },
        {
          id: 5,
          title: "Art Exhibition",
          description: "A showcase of contemporary art from emerging artists. Explore diverse styles and mediums.",
          date: "April 19, 2024",
          time: "11:00 AM",
          location: "Los Angeles, CA",
          category: "Art",
          price: 50,
          maxAttendees: 150,
          attendees: 112,
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d59a4?w=800&h=400&fit=crop",
          organizer: "Art Gallery",
          organizerId: 5
        }
      ];
      localStorage.setItem(this.eventsKey, JSON.stringify(sampleEvents));
    }
  }

  getAllEvents(): Event[] {
    const stored = localStorage.getItem(this.eventsKey);
    return stored ? JSON.parse(stored) : [];
  }

  getEventById(id: number): Event | null {
    const events = this.getAllEvents();
    return events.find(event => event.id === id) || null;
  }

  createEvent(eventData: CreateEventData, organizerId: number): Event {
    const events = this.getAllEvents();
    const newEvent: Event = {
      id: Date.now(),
      ...eventData,
      attendees: 0,
      organizer: "Current User",
      organizerId
    };
    
    events.push(newEvent);
    localStorage.setItem(this.eventsKey, JSON.stringify(events));
    return newEvent;
  }

  updateEvent(id: number, updates: Partial<CreateEventData>, organizerId: number): Event | null {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === id);
    
    if (eventIndex === -1) return null;
    
    const event = events[eventIndex];
    if (event.organizerId !== organizerId) return null;
    
    events[eventIndex] = { ...event, ...updates };
    localStorage.setItem(this.eventsKey, JSON.stringify(events));
    return events[eventIndex];
  }

  registerForEvent(eventId: number): boolean {
    const events = this.getAllEvents();
    const eventIndex = events.findIndex(event => event.id === eventId);
    
    if (eventIndex === -1) return false;
    
    const event = events[eventIndex];
    if (event.attendees >= event.maxAttendees) return false;
    
    events[eventIndex] = { ...event, attendees: event.attendees + 1 };
    localStorage.setItem(this.eventsKey, JSON.stringify(events));
    return true;
  }
}

export const eventService = new EventService();
