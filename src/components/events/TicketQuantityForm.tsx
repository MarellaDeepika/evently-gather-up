
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Users } from "lucide-react";

interface TicketQuantityFormProps {
  maxTickets: number;
  ticketPrice: number;
  onQuantityChange: (quantity: number) => void;
  onContinue: () => void;
}

const TicketQuantityForm = ({ maxTickets, ticketPrice, onQuantityChange, onContinue }: TicketQuantityFormProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, maxTickets));
    setQuantity(validQuantity);
    onQuantityChange(validQuantity);
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Select Number of Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <div className="text-3xl font-bold">{quantity}</div>
            <div className="text-sm text-gray-600">
              {quantity === 1 ? 'ticket' : 'tickets'}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= maxTickets}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <Input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            min={1}
            max={maxTickets}
            className="w-20 mx-auto text-center"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Total Cost:</span>
            <span className="text-2xl font-bold text-blue-600">
              ${(ticketPrice * quantity).toFixed(2)}
            </span>
          </div>
          
          <Button onClick={onContinue} className="w-full">
            Continue to Attendee Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketQuantityForm;
