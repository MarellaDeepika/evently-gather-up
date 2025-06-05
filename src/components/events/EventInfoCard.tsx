
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { Event } from "@/services/eventService";

interface EventInfoCardProps {
  event: Event;
}

const EventInfoCard = ({ event }: EventInfoCardProps) => {
  return (
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
  );
};

export default EventInfoCard;
