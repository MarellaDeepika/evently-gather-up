
export interface PaymentData {
  amount: number;
  currency: string;
  eventId: number;
  ticketType: 'general' | 'vip' | 'early-bird';
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class PaymentService {
  // Simulate payment processing
  async processPayment(paymentData: PaymentData): Promise<PaymentResult> {
    console.log('💳 Processing payment:', paymentData);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate random payment success/failure for demo
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        success: true,
        transactionId
      };
    } else {
      return {
        success: false,
        error: 'Payment declined. Please check your payment details.'
      };
    }
  }

  // Get payment methods with more India-specific options
  getPaymentMethods(): string[] {
    return [
      'Credit Card', 
      'Debit Card', 
      'UPI',
      'PayTM',
      'PhonePe',
      'Google Pay',
      'Amazon Pay',
      'Net Banking',
      'BHIM',
      'Freecharge',
      'MobiKwik'
    ];
  }

  // Calculate fees in INR
  calculateFees(amount: number): { subtotal: number; fees: number; total: number } {
    const fees = Math.round(amount * 0.02 + 20); // 2% + ₹20 (typical Indian payment gateway fees)
    return {
      subtotal: amount,
      fees,
      total: amount + fees
    };
  }
}

export const paymentService = new PaymentService();
