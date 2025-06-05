
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { eventService, Event } from "@/services/eventService";
import { ticketService } from "@/services/ticketService";
import { authService } from "@/services/authService";
import { emailService } from "@/services/emailService";
import { qrService } from "@/services/qrService";
import { paymentService, PaymentData } from "@/services/paymentService";
import { couponService } from "@/services/couponService";
import EventDetailsNavigation from "@/components/events/EventDetailsNavigation";
import EventHeader from "@/components/events/EventHeader";
import EventInfoCard from "@/components/events/EventInfoCard";
import RegistrationForm from "@/components/events/RegistrationForm";
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

    processRegistration();
  };

  const processRegistration = async (transactionId?: string) => {
    if (!event) return;

    setIsRegistering(true);

    try {
      const success = eventService.registerForEvent(event.id);
      
      if (success) {
        if (appliedCoupon && user) {
          couponService.useCoupon(appliedCoupon.id, user.id, event.id, appliedCoupon.discountAmount * 100);
        }

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

        const qrCodeDataUrl = qrService.generateQRCode(ticket.id);
        const ticketImageDataUrl = qrService.generateTicketImage({
          ticketId: ticket.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventLocation: event.location,
          userName: `${registrationData.firstName} ${registrationData.lastName}`
        });

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
        });

        setEvent(prev => prev ? {...prev, attendees: prev.attendees + 1} : null);
        
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
        amount: finalAmount * 100,
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

  const isEventOwner = user && event.organizer === "Current User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <EventDetailsNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link to="/events" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <EventHeader 
              event={event} 
              isEventOwner={!!isEventOwner}
              onShare={handleShare}
              onEdit={() => setShowEditModal(true)}
            />
            <EventInfoCard event={event} />
          </div>

          <div className="space-y-6">
            <RegistrationForm
              event={event}
              user={user}
              registrationData={registrationData}
              setRegistrationData={setRegistrationData}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              appliedCoupon={appliedCoupon}
              showPayment={showPayment}
              isRegistering={isRegistering}
              isProcessingPayment={isProcessingPayment}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              onRegistration={handleRegistration}
              onPayment={handlePayment}
              onCouponApply={handleCouponApply}
              onBackToForm={() => setShowPayment(false)}
            />
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
