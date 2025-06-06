
export interface BankAccount {
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  bankName: string;
}

export interface BankTransferData {
  amount: number;
  currency: string;
  bankAccount: BankAccount;
  recipientInfo: {
    name: string;
    email: string;
  };
  eventId: number;
  reference: string;
}

export interface BankTransferResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  estimatedClearingTime?: string;
}

class BankPaymentService {
  // Simulate bank transfer processing
  async processBankTransfer(transferData: BankTransferData): Promise<BankTransferResult> {
    console.log('🏦 Processing bank transfer:', transferData);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Basic validation
    if (!this.validateBankAccount(transferData.bankAccount)) {
      return {
        success: false,
        error: 'Invalid bank account information'
      };
    }

    if (transferData.amount <= 0) {
      return {
        success: false,
        error: 'Invalid transfer amount'
      };
    }

    // Simulate successful transfer
    const transactionId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      estimatedClearingTime: '1-3 business days'
    };
  }

  // Get supported banks
  getSupportedBanks(): Array<{ name: string; code: string; logo?: string }> {
    return [
      { name: 'Chase Bank', code: 'CHASE' },
      { name: 'Bank of America', code: 'BOA' },
      { name: 'Wells Fargo', code: 'WF' },
      { name: 'Citibank', code: 'CITI' },
      { name: 'US Bank', code: 'USB' },
      { name: 'PNC Bank', code: 'PNC' },
      { name: 'Capital One', code: 'CAPO' },
      { name: 'TD Bank', code: 'TD' },
      { name: 'Other', code: 'OTHER' }
    ];
  }

  // Calculate transfer fees
  calculateTransferFee(amount: number): { fee: number; total: number } {
    // Simulate bank transfer fees
    const feePercentage = 0.005; // 0.5%
    const minimumFee = 1.50;
    const maximumFee = 10.00;
    
    let fee = Math.max(minimumFee, amount * feePercentage);
    fee = Math.min(fee, maximumFee);
    
    return {
      fee: Math.round(fee * 100) / 100,
      total: Math.round((amount + fee) * 100) / 100
    };
  }

  // Validate bank account information
  private validateBankAccount(account: BankAccount): boolean {
    // Basic validation rules
    if (!account.accountNumber || account.accountNumber.length < 8 || account.accountNumber.length > 17) {
      return false;
    }

    if (!account.routingNumber || account.routingNumber.length !== 9) {
      return false;
    }

    // Check if routing number is numeric
    if (!/^\d{9}$/.test(account.routingNumber)) {
      return false;
    }

    // Check if account number is alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(account.accountNumber)) {
      return false;
    }

    return true;
  }

  // Generate payment instructions for manual bank transfer
  generatePaymentInstructions(eventTitle: string, amount: number, reference: string): {
    recipientName: string;
    recipientAccount: string;
    routingNumber: string;
    amount: number;
    reference: string;
    instructions: string[];
  } {
    return {
      recipientName: 'Evently Events Inc.',
      recipientAccount: '****-****-****-1234',
      routingNumber: '021000021',
      amount,
      reference,
      instructions: [
        'Log into your online banking or visit your bank branch',
        'Set up a new wire transfer or ACH payment',
        'Use the recipient information provided above',
        'Include the reference number in the memo/description field',
        'Submit the transfer and save the confirmation',
        'Your event registration will be confirmed once payment clears (1-3 business days)'
      ]
    };
  }
}

export const bankPaymentService = new BankPaymentService();
