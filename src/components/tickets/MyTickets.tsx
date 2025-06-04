
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Ticket, TicketPlus, Calendar } from "lucide-react";
import { ticketService } from "@/services/ticketService";
import { eventService } from "@/services/eventService";
import { authService } from "@/services/authService";
import TicketCard from "./TicketCard";
import FeedbackForm from "../feedback/FeedbackForm";

const MyTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [user] = useState(authService.getCurrentUser());

  useEffect(() => {
    if (user) {
      const userTickets = ticketService.getTicketsByUser(user.id);
      const ticketsWithEvents = userTickets.map(ticket => {
        const event = eventService.getEventById(ticket.eventId);
        return { ...ticket, event };
      });
      setTickets(ticketsWithEvents);
    }
  }, [user]);

  const activeTickets = tickets.filter(t => t.status === 'active');
  const usedTickets = tickets.filter(t => t.status === 'used');
  const cancelledTickets = tickets.filter(t => t.status === 'cancelled');

  const isEventCompleted = (eventDate: string) => {
    return new Date(eventDate) < new Date();
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <Ticket className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to view your tickets</h3>
        <p className="text-gray-600">Please sign in to see your event tickets and manage your bookings.</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <TicketPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
        <p className="text-gray-600 mb-4">Start exploring events and book your first ticket!</p>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Browse Events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Tickets</h2>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">
            Active ({activeTickets.length})
          </TabsTrigger>
          <TabsTrigger value="used">
            Used ({usedTickets.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              eventTitle={ticket.event?.title || 'Unknown Event'}
              eventDate={ticket.event?.date || ''}
              eventLocation={ticket.event?.location || ''}
            />
          ))}
        </TabsContent>

        <TabsContent value="used" className="space-y-4">
          {usedTickets.map(ticket => (
            <div key={ticket.id} className="space-y-4">
              <TicketCard
                ticket={ticket}
                eventTitle={ticket.event?.title || 'Unknown Event'}
                eventDate={ticket.event?.date || ''}
                eventLocation={ticket.event?.location || ''}
              />
              {ticket.event && isEventCompleted(ticket.event.date) && (
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg">How was your experience?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FeedbackForm eventId={ticket.eventId} ticketId={ticket.id} />
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              eventTitle={ticket.event?.title || 'Unknown Event'}
              eventDate={ticket.event?.date || ''}
              eventLocation={ticket.event?.location || ''}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTickets;
