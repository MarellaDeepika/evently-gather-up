
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

  // Only show role switcher for organizers
  if (currentRole !== 'organizer') {
    return null;
  }

  const handleRoleSwitch = async () => {
    setIsLoading(true);
    const newRole = 'attendee'; // Organizers can only switch to attendee mode
    
    const success = authService.switchRole(newRole);
    
    if (success) {
      onRoleChange(newRole);
      toast({
        title: "Switched to Attendee Mode",
        description: "You are now browsing as an attendee.",
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
      Switch to Attendee View
    </Button>
  );
};

export default RoleSwitcher;
