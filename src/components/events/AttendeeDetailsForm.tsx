
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, ArrowLeft } from "lucide-react";

interface AttendeeInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AttendeeDetailsFormProps {
  quantity: number;
  onAttendeesChange: (attendees: AttendeeInfo[]) => void;
  onBack: () => void;
  onContinue: () => void;
  initialAttendees?: AttendeeInfo[];
}

const AttendeeDetailsForm = ({ 
  quantity, 
  onAttendeesChange, 
  onBack, 
  onContinue,
  initialAttendees = []
}: AttendeeDetailsFormProps) => {
  const [attendees, setAttendees] = useState<AttendeeInfo[]>(() => {
    const initial = [...initialAttendees];
    while (initial.length < quantity) {
      initial.push({ firstName: "", lastName: "", email: "", phone: "" });
    }
    return initial.slice(0, quantity);
  });

  const updateAttendee = (index: number, field: keyof AttendeeInfo, value: string) => {
    const updated = [...attendees];
    updated[index] = { ...updated[index], [field]: value };
    setAttendees(updated);
    onAttendeesChange(updated);
  };

  const isFormValid = attendees.every(attendee => 
    attendee.firstName && attendee.lastName && attendee.email
  );

  return (
    <Card className="border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Attendee Details ({quantity} {quantity === 1 ? 'ticket' : 'tickets'})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {attendees.map((attendee, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Attendee {index + 1}</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`firstName-${index}`}>First Name *</Label>
                <Input
                  id={`firstName-${index}`}
                  value={attendee.firstName}
                  onChange={(e) => updateAttendee(index, 'firstName', e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
                <Input
                  id={`lastName-${index}`}
                  value={attendee.lastName}
                  onChange={(e) => updateAttendee(index, 'lastName', e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`email-${index}`}>Email Address *</Label>
              <Input
                id={`email-${index}`}
                type="email"
                value={attendee.email}
                onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor={`phone-${index}`}>Phone Number</Label>
              <Input
                id={`phone-${index}`}
                type="tel"
                value={attendee.phone}
                onChange={(e) => updateAttendee(index, 'phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        ))}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button 
            onClick={onContinue} 
            disabled={!isFormValid}
            className="flex-1"
          >
            Continue to Snacks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendeeDetailsForm;
