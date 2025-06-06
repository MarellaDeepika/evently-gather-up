
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, RotateCcw } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface RoleSwitcherProps {
  currentRole: 'organizer' | 'attendee';
  onRoleChange: (newRole: 'organizer' | 'attendee') => void;
}

const RoleSwitcher = ({ currentRole, onRoleChange }: RoleSwitcherProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if user is actually an organizer (can switch both ways)
  const user = authService.getCurrentUser();
  const isActualOrganizer = user?.role === 'organizer' || (user && 'originalRole' in user && user.originalRole === 'organizer');

  // Only show for organizers
  if (!isActualOrganizer) {
    return null;
  }

  const handleRoleSwitch = async () => {
    setIsLoading(true);
    const newRole = currentRole === 'organizer' ? 'attendee' : 'organizer';
    
    const success = authService.switchRole(newRole);
    
    if (success) {
      onRoleChange(newRole);
      toast({
        title: `Switched to ${newRole === 'organizer' ? 'Organizer' : 'Attendee'} Mode`,
        description: `You are now browsing as ${newRole === 'organizer' ? 'an organizer' : 'an attendee'}.`,
      });
    } else {
      toast({
        title: "Switch Failed",
        description: "Unable to switch role. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRoleSwitch}
      disabled={isLoading}
      className="flex items-center"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      <Users className="h-4 w-4 mr-1" />
      Switch to {currentRole === 'organizer' ? 'Attendee' : 'Organizer'} View
    </Button>
  );
};

export default RoleSwitcher;
