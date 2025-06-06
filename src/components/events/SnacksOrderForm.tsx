
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Coffee, Sandwich, Cookie, Plus, Minus } from "lucide-react";

interface SnackItem {
  id: string;
  name: string;
  price: number;
  icon: any;
  description: string;
}

interface SnackOrder {
  [key: string]: number;
}

interface SnacksOrderFormProps {
  onSnacksChange: (snacks: SnackOrder, total: number) => void;
  onBack: () => void;
  onContinue: () => void;
  initialSnacks?: SnackOrder;
}

const snackItems: SnackItem[] = [
  {
    id: "coffee",
    name: "Coffee",
    price: 5.00,
    icon: Coffee,
    description: "Fresh brewed coffee"
  },
  {
    id: "sandwich",
    name: "Sandwich",
    price: 12.00,
    icon: Sandwich,
    description: "Delicious gourmet sandwich"
  },
  {
    id: "cookies",
    name: "Cookies",
    price: 3.00,
    icon: Cookie,
    description: "Fresh baked cookies (pack of 3)"
  }
];

const SnacksOrderForm = ({ onSnacksChange, onBack, onContinue, initialSnacks = {} }: SnacksOrderFormProps) => {
  const [snackOrder, setSnackOrder] = useState<SnackOrder>(initialSnacks);

  const updateSnackQuantity = (snackId: string, quantity: number) => {
    const updated = { ...snackOrder };
    if (quantity <= 0) {
      delete updated[snackId];
    } else {
      updated[snackId] = quantity;
    }
    setSnackOrder(updated);
    
    const total = snackItems.reduce((sum, item) => {
      return sum + (updated[item.id] || 0) * item.price;
    }, 0);
    
    onSnacksChange(updated, total);
  };

  const getTotalCost = () => {
    return snackItems.reduce((sum, item) => {
      return sum + (snackOrder[item.id] || 0) * item.price;
    }, 0);
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Coffee className="h-5 w-5 mr-2" />
          Order Snacks (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {snackItems.map((item) => {
            const quantity = snackOrder[item.id] || 0;
            const Icon = item.icon;
            
            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <Badge variant="outline">${item.price.toFixed(2)}</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateSnackQuantity(item.id, quantity - 1)}
                      disabled={quantity <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateSnackQuantity(item.id, quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {getTotalCost() > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Snacks Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${getTotalCost().toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={onContinue} className="flex-1">
            Continue to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SnacksOrderForm;
