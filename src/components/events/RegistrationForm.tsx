
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, CreditCard, Tag } from "lucide-react";
import { Event } from "@/services/eventService";
import { paymentService } from "@/services/paymentService";

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
  const finalPrice = appliedCoupon 
    ? Math.max(0, event.price - appliedCoupon.discountAmount)
    : event.price;
  const fees = paymentService.calculateFees(finalPrice * 100);

  return (
    <Card className="border-0 bg-white/80 backdrop-blur sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Ticket className="h-5 w-5 mr-2" />
          {showPayment ? "Payment Details" : "Register for Event"}
        </CardTitle>
        <CardDescription>
          {showPayment ? "Complete your payment to secure your spot" : "Secure your spot at this amazing event"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {showPayment ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Ticket Price:</span>
                  <span>${event.price.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({appliedCoupon.code}):</span>
                    <span>-${appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${(fees.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>${(fees.fees / 100).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${(fees.total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentService.getPaymentMethods().map(method => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={onBackToForm}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={onPayment}
                disabled={isProcessingPayment}
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isProcessingPayment ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onRegistration} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={registrationData.firstName}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={registrationData.lastName}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={registrationData.email}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={registrationData.phone}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={registrationData.specialRequests}
                onChange={(e) => setRegistrationData(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any dietary restrictions or special accommodations?"
                className="min-h-[80px]"
              />
            </div>

            {event.price > 0 && (
              <div className="border-t pt-4">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                  <Button type="button" onClick={onCouponApply} variant="outline">
                    <Tag className="h-4 w-4 mr-2" />
                    Apply
                  </Button>
                </div>
              </div>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <div className="text-right">
                  {appliedCoupon && event.price > 0 && (
                    <div className="text-sm text-gray-500 line-through">
                      ${event.price.toFixed(2)}
                    </div>
                  )}
                  <span className="text-2xl font-bold text-blue-600">
                    {finalPrice > 0 ? `$${finalPrice.toFixed(2)}` : 'Free'}
                  </span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg rounded-xl"
                disabled={isRegistering || event.attendees >= event.maxAttendees}
              >
                {isRegistering ? "Processing..." : 
                 event.attendees >= event.maxAttendees ? "Event Full" : 
                 finalPrice > 0 ? "Continue to Payment" : "Register Now"}
              </Button>
            </div>
          </form>
        )}
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Secure registration • Instant confirmation • QR ticket included
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
