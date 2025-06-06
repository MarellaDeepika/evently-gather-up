
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, CreditCard, Tag, Banknote } from "lucide-react";
import { Event } from "@/services/eventService";
import { paymentService } from "@/services/paymentService";
import { bankPaymentService } from "@/services/bankPaymentService";
import TicketQuantityForm from "./TicketQuantityForm";
import AttendeeDetailsForm from "./AttendeeDetailsForm";
import SnacksOrderForm from "./SnacksOrderForm";

interface AttendeeInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface RegistrationFormProps {
  event: Event;
  user: any;
  registrationData: any;
  setRegistrationData: (data: any) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: any;
  showPayment: boolean;
  isRegistering: boolean;
  isProcessingPayment: boolean;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  onRegistration: (e: React.FormEvent) => void;
  onPayment: () => void;
  onCouponApply: () => void;
  onBackToForm: () => void;
}

const RegistrationForm = ({
  event,
  user,
  registrationData,
  setRegistrationData,
  couponCode,
  setCouponCode,
  appliedCoupon,
  showPayment,
  isRegistering,
  isProcessingPayment,
  paymentMethod,
  setPaymentMethod,
  onRegistration,
  onPayment,
  onCouponApply,
  onBackToForm
}: RegistrationFormProps) => {
  const [currentStep, setCurrentStep] = useState<'quantity' | 'attendees' | 'snacks' | 'payment'>('quantity');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [snacksOrder, setSnacksOrder] = useState<any>({});
  const [snacksTotal, setSnacksTotal] = useState(0);

  const finalPrice = appliedCoupon 
    ? Math.max(0, event.price - appliedCoupon.discountAmount)
    : event.price;
  
  const ticketsTotal = finalPrice * ticketQuantity;
  const grandTotal = ticketsTotal + snacksTotal;
  const fees = paymentService.calculateFees(grandTotal * 100);
  const bankFees = bankPaymentService.calculateTransferFee(grandTotal);

  const handleQuantityNext = () => {
    setCurrentStep('attendees');
  };

  const handleAttendeesNext = () => {
    setCurrentStep('snacks');
  };

  const handleSnacksNext = () => {
    if (grandTotal > 0) {
      setCurrentStep('payment');
    } else {
      // Free event - proceed directly to registration
      onRegistration({ preventDefault: () => {} } as React.FormEvent);
    }
  };

  const availableTickets = event.maxAttendees - event.attendees;

  if (currentStep === 'quantity') {
    return (
      <TicketQuantityForm
        maxTickets={Math.min(availableTickets, 10)}
        ticketPrice={finalPrice}
        onQuantityChange={setTicketQuantity}
        onContinue={handleQuantityNext}
      />
    );
  }

  if (currentStep === 'attendees') {
    return (
      <AttendeeDetailsForm
        quantity={ticketQuantity}
        onAttendeesChange={setAttendees}
        onBack={() => setCurrentStep('quantity')}
        onContinue={handleAttendeesNext}
        initialAttendees={attendees}
      />
    );
  }

  if (currentStep === 'snacks') {
    return (
      <SnacksOrderForm
        onSnacksChange={(snacks, total) => {
          setSnacksOrder(snacks);
          setSnacksTotal(total);
        }}
        onBack={() => setCurrentStep('attendees')}
        onContinue={handleSnacksNext}
        initialSnacks={snacksOrder}
      />
    );
  }

  // Payment step
  return (
    <Card className="border-0 bg-white/80 backdrop-blur sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Ticket className="h-5 w-5 mr-2" />
          Payment Details
        </CardTitle>
        <CardDescription>
          Complete your payment to secure your spots
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tickets ({ticketQuantity}x):</span>
                <span>${ticketsTotal.toFixed(2)}</span>
              </div>
              {snacksTotal > 0 && (
                <div className="flex justify-between">
                  <span>Snacks:</span>
                  <span>${snacksTotal.toFixed(2)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>-${(appliedCoupon.discountAmount * ticketQuantity).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span>Subtotal:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
              {paymentMethod === 'Credit Card' && (
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>${(fees.fees / 100).toFixed(2)}</span>
                </div>
              )}
              {paymentMethod === 'Bank Transfer' && (
                <div className="flex justify-between">
                  <span>Transfer Fee:</span>
                  <span>${bankFees.fee.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>
                  ${paymentMethod === 'Credit Card' ? (fees.total / 100).toFixed(2) : 
                     paymentMethod === 'Bank Transfer' ? bankFees.total.toFixed(2) : 
                     grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium mb-2">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credit Card">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit Card
                  </div>
                </SelectItem>
                <SelectItem value="Bank Transfer">
                  <div className="flex items-center">
                    <Banknote className="h-4 w-4 mr-2" />
                    Bank Transfer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('snacks')}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={onPayment}
              disabled={isProcessingPayment}
              className="flex-1"
            >
              {paymentMethod === 'Credit Card' ? (
                <CreditCard className="h-4 w-4 mr-2" />
              ) : (
                <Banknote className="h-4 w-4 mr-2" />
              )}
              {isProcessingPayment ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Secure registration • Instant confirmation • Individual QR tickets
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
