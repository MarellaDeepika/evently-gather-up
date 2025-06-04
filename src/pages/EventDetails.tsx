import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Clock, DollarSign, Star, ArrowLeft, Share2, Heart, Ticket, Download, CreditCard, Edit, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { eventService, Event } from "@/services/eventService";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import { emailService } from "@/services/emailService";
import { qrService } from "@/services/qrService";
import { paymentService, PaymentData } from "@/services/paymentService";
import { couponService } from "@/services/couponService";
import EditEventModal from "@/components/events/EditEventModal";

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState(authService.getCurrentUser());
  const [showPayment, setShowPayment] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [registrationData, setRegistrationData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    specialRequests: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Load event data
  useEffect(() => {
    if (id) {
      const loadedEvent = eventService.getEventById(parseInt(id));
      setEvent(loadedEvent);
    }
  }, [id]);

  const handleCouponApply = () => {
    if (!event || !couponCode.trim()) return;

    const result = couponService.validateCoupon(couponCode, event.id, event.price * 100);
    
    if (result.valid && result.coupon && result.discount !== undefined) {
      setAppliedCoupon({
        ...result.coupon,
        discountAmount: result.discount / 100 // Convert back to dollars
      });
      toast({
        title: "Coupon Applied!",
        description: `You saved $${(result.discount / 100).toFixed(2)} with code ${result.coupon.code}`,
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: result.error || "Please check your coupon code.",
        variant: "destructive",
      });
    }
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (event.price > 0) {
      setShowPayment(true);
      return;
    }

    // Free event registration
    processRegistration();
  };

  const processRegistration = async (transactionId?: string) => {
    if (!event) return;

    setIsRegistering(true);

    try {
      // Register for event
      const success = eventService.registerForEvent(event.id);
      
      if (success) {
        // Use coupon if applied
        if (appliedCoupon && user) {
          couponService.useCoupon(appliedCoupon.id, user.id, event.id, appliedCoupon.discountAmount * 100);
        }

        // Create ticket
        const finalPrice = appliedCoupon 
          ? Math.max(0, event.price - appliedCoupon.discountAmount)
          : event.price;

        const ticket = ticketService.purchaseTicket(
          {
            eventId: event.id,
            ticketType: appliedCoupon?.couponType === 'vip' ? 'vip' : 'general',
            userInfo: {
              firstName: registrationData.firstName,
              lastName: registrationData.lastName,
              email: registrationData.email,
              phone: registrationData.phone
            }
          },
          user?.id || 1,
          finalPrice
        );

        // Generate QR code and ticket
        const qrCodeDataUrl = qrService.generateQRCode(ticket.id);
        const ticketImageDataUrl = qrService.generateTicketImage({
          ticketId: ticket.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          userName: `${registrationData.firstName} ${registrationData.lastName}`
        });

        // Send confirmation email
        try {
          await emailService.sendBookingConfirmation(
            registrationData.email,
            `${registrationData.firstName} ${registrationData.lastName}`,
            event.title,
            event.date,
            event.location,
            ticket.id,
            qrCodeDataUrl
          );
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }

        toast({
          title: "Registration Successful!",
          description: appliedCoupon 
            ? `Saved $${appliedCoupon.discountAmount.toFixed(2)} with coupon! Confirmation email sent.`
            : "Confirmation email sent with your QR ticket.",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => qrService.downloadTicket(ticketImageDataUrl, `ticket-${ticket.id}.png`)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
          ),
        });

        // Update local event state
        setEvent(prev => prev ? {...prev, attendees: prev.attendees + 1} : null);
        
        // Reset form
        setRegistrationData({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          phone: "",
          specialRequests: ""
        });
        setShowPayment(false);
        setCouponCode("");
        setAppliedCoupon(null);
      } else {
        toast({
          title: "Registration Failed",
          description: "Event is full or registration failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePayment = async () => {
    if (!event) return;

    setIsProcessingPayment(true);

    try {
      const finalAmount = appliedCoupon 
        ? Math.max(0, event.price - appliedCoupon.discountAmount)
        : event.price;

      const paymentData: PaymentData = {
        amount: finalAmount * 100, // Convert to cents
        currency: 'usd',
        eventId: event.id,
        ticketType: appliedCoupon?.couponType === 'vip' ? 'vip' : 'general',
        userInfo: {
          firstName: registrationData.firstName,
          lastName: registrationData.lastName,
          email: registrationData.email,
          phone: registrationData.phone
        }
      };

      const result = await paymentService.processPayment(paymentData);

      if (result.success) {
        toast({
          title: "Payment Successful!",
          description: `Transaction ID: ${result.transactionId}`,
        });
        
        await processRegistration(result.transactionId);
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Payment processing failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong with payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to your clipboard.",
      });
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const finalPrice = appliedCoupon 
    ? Math.max(0, event.price - appliedCoupon.discountAmount)
    : event.price;
  const fees = paymentService.calculateFees(finalPrice * 100);
  const isEventOwner = user && event.organizer === "Current User"; // In real app, check actual ownership

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Evently</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/events" className="text-gray-700 hover:text-blue-600 transition-colors">
                Browse Events
              </Link>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/create-event" className="text-gray-700 hover:text-blue-600 transition-colors">
                Create Event
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          {isEventOwner && (
            <Button onClick={() => setShowEditModal(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
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
                <Button variant="secondary" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <Card className="border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-3xl font-bold mb-2">{event.title}</CardTitle>
                    <CardDescription className="text-lg">{event.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {event.price > 0 ? `$${event.price}` : 'Free'}
                    </div>
                    <div className="text-sm text-gray-600">per ticket</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{event.attendees} / {event.maxAttendees} attendees</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">{event.date}</div>
                        <div className="text-sm text-gray-600">{event.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium">Venue</div>
                        <div className="text-sm text-gray-600">{event.location}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">
                          {event.organizer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{event.organizer}</div>
                        <div className="text-sm text-gray-600">Event Organizer</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Event Capacity</span>
                    <span>{Math.round((event.attendees / event.maxAttendees) * 100)}% full</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration Sidebar */}
          <div className="space-y-6">
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
                        onClick={() => setShowPayment(false)}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                        className="flex-1"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        {isProcessingPayment ? "Processing..." : "Pay Now"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleRegistration} className="space-y-4">
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
          </div>
        </div>
      </div>

      <EditEventModal
        event={event}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(updatedEvent) => setEvent(updatedEvent)}
      />
    </div>
  );
};

export default EventDetails;
