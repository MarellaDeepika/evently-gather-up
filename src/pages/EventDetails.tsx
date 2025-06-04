import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Users, Clock, DollarSign, Star, ArrowLeft, Share2, Heart, Ticket } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { eventService, Event } from "@/services/eventService";
import { ticketService } from "@/services/ticketService";

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  // Load event data
  useEffect(() => {
    if (id) {
      const loadedEvent = eventService.getEventById(parseInt(id));
      setEvent(loadedEvent);
    }
  }, [id]);

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsRegistering(true);

    setTimeout(() => {
      try {
        // Register for event (increase attendee count)
        const success = eventService.registerForEvent(event.id);
        
        if (success) {
          // Create ticket
          ticketService.purchaseTicket(
            {
              eventId: event.id,
              ticketType: 'general',
              userInfo: {
                firstName: registrationData.firstName,
                lastName: registrationData.lastName,
                email: registrationData.email,
                phone: registrationData.phone
              }
            },
            1, // Mock user ID
            event.price
          );

          toast({
            title: "Registration Successful!",
            description: "You've been registered for the event. Check your email for confirmation.",
          });

          // Update local event state
          setEvent(prev => prev ? {...prev, attendees: prev.attendees + 1} : null);
          
          setRegistrationData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            specialRequests: ""
          });
        } else {
          toast({
            title: "Registration Failed",
            description: "Event is full or registration failed. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsRegistering(false);
      }
    }, 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to your clipboard.",
      });
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
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
        {/* Back Navigation */}
        <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                  {event.category}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <Card className="border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-lg">{event.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {event.price > 0 ? `$${event.price}` : 'Free'}
                    </div>
                    <div className="text-sm text-gray-600">per ticket</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{event.attendees} / {event.maxAttendees} attendees</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-sm text-gray-600">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Venue</div>
                        <div className="text-sm text-gray-600">{event.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {event.organizer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{event.organizer}</div>
                        <div className="text-sm text-gray-600">Event Organizer</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Event Capacity</span>
                    <span>{Math.round((event.attendees / event.maxAttendees) * 100)}% full</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 bg-white/80 backdrop-blur sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ticket className="h-5 w-5 mr-2" />
                  Register for Event
                </CardTitle>
                <CardDescription>Secure your spot at this amazing event</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={registrationData.firstName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={registrationData.lastName}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registrationData.email}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={registrationData.phone}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={registrationData.specialRequests}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      placeholder="Any dietary restrictions or special accommodations?"
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Total</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {event.price > 0 ? `$${event.price}` : 'Free'}
                      </span>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-lg rounded-xl"
                      disabled={isRegistering || event.attendees >= event.maxAttendees}
                    >
                      {isRegistering ? "Processing..." : 
                       event.attendees >= event.maxAttendees ? "Event Full" : "Register Now"}
                    </Button>
                  </div>
                </form>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Secure registration • Instant confirmation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
