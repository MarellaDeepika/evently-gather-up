
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Download, Share2, QrCode, Star } from "lucide-react";
import { Ticket } from "@/services/ticketService";
import { qrService } from "@/services/qrService";
import { useToast } from "@/hooks/use-toast";

interface TicketCardProps {
  ticket: Ticket;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
}

const TicketCard = ({ ticket, eventTitle, eventDate, eventLocation }: TicketCardProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const ticketImageDataUrl = qrService.generateTicketImage({
      ticketId: ticket.id,
      eventTitle,
      eventDate,
      eventLocation,
      userName: `${ticket.userInfo.firstName} ${ticket.userInfo.lastName}`
    });
    
    qrService.downloadTicket(ticketImageDataUrl, `ticket-${ticket.id}.png`);
    
    toast({
      title: "Ticket Downloaded",
      description: "Your ticket has been downloaded successfully.",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `My ticket for ${eventTitle}`,
      text: `I'm attending ${eventTitle} on ${eventDate}!`,
      url: window.location.origin + `/events/${ticket.eventId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareData.url);
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard!",
        });
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard!",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{eventTitle}</CardTitle>
            <Badge className={`mt-2 ${getStatusColor(ticket.status)}`}>
              {ticket.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${ticket.price}</div>
            <div className="text-sm opacity-90">{ticket.ticketType}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {eventDate}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {eventLocation}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Ticket ID:</strong> {ticket.id}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Purchased:</strong> {new Date(ticket.purchaseDate).toLocaleDateString()}
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-24 h-24 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
              <QrCode className="h-12 w-12 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 text-center">
              Present this QR code at the event entrance
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <Button onClick={handleDownload} variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button onClick={handleShare} variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
