
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, RotateCcw } from "lucide-react";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface RoleSwitcherProps {
  currentRole: 'organizer' | 'attendee';
  onRoleChange: (newRole: 'organizer' | 'attendee') => void;
}

const RoleSwitcher = ({ currentRole, onRoleChange }: RoleSwitcherProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleSwitch = async () => {
    setIsLoading(true);
    const newRole = currentRole === 'organizer' ? 'attendee' : 'organizer';
    
    const success = authService.switchRole(newRole);
    
    if (success) {
      onRoleChange(newRole);
      toast({
        title: "Role Switched",
        description: `You are now in ${newRole} mode.`,
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
      {currentRole === 'organizer' ? (
        <>
          <UserCheck className="h-4 w-4 mr-1" />
          Switch to Attendee
        </>
      ) : (
        <>
          <Users className="h-4 w-4 mr-1" />
          Switch to Organizer
        </>
      )}
    </Button>
  );
};

export default RoleSwitcher;
