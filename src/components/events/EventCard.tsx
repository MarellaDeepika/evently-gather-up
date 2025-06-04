
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Event } from "@/services/eventService";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur">
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
          <span className="text-sm font-medium text-gray-900">
            {event.price > 0 ? `$${event.price}` : 'Free'}
          </span>
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
            {event.date} at {event.time}
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
  );
};

export default EventCard;
