
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Edit } from "lucide-react";
import { Event } from "@/services/eventService";

interface EventHeaderProps {
  event: Event;
  isEventOwner: boolean;
  onShare: () => void;
  onEdit: () => void;
}

const EventHeader = ({ event, isEventOwner, onShare, onEdit }: EventHeaderProps) => {
  return (
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
        <Button variant="secondary" size="sm" onClick={onShare}>
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="sm">
          <Heart className="h-4 w-4" />
        </Button>
        {isEventOwner && (
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventHeader;
