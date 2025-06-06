
export interface Ticket {
  id: string;
  eventId: number;
  userId: number;
  ticketType: 'general' | 'vip' | 'early-bird';
  price: number; // Price in INR
  status: 'active' | 'used';
  qrCode: string;
  purchaseDate: string;
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface PurchaseTicketData {
  eventId: number;
  ticketType: 'general' | 'vip' | 'early-bird';
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

class TicketService {
  private ticketsKey = 'evently_tickets';

  // Get all tickets
  getAllTickets(): Ticket[] {
    const stored = localStorage.getItem(this.ticketsKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Get tickets by user
  getTicketsByUser(userId: number): Ticket[] {
    return this.getAllTickets().filter(ticket => ticket.userId === userId);
  }

  // Get tickets by event
  getTicketsByEvent(eventId: number): Ticket[] {
    return this.getAllTickets().filter(ticket => ticket.eventId === eventId);
  }

  // Purchase ticket
  purchaseTicket(purchaseData: PurchaseTicketData, userId: number, eventPrice: number): Ticket {
    const tickets = this.getAllTickets();
    
    const newTicket: Ticket = {
      id: this.generateTicketId(),
      eventId: purchaseData.eventId,
      userId: userId,
      ticketType: purchaseData.ticketType,
      price: eventPrice, // Price in INR
      status: 'active',
      qrCode: this.generateUniqueQRCode(purchaseData.eventId, userId, purchaseData.userInfo.email),
      purchaseDate: new Date().toISOString(),
      userInfo: purchaseData.userInfo
    };

    tickets.push(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  // Validate ticket (for check-in)
  validateTicket(ticketId: string): { valid: boolean; ticket?: Ticket; message: string } {
    const tickets = this.getAllTickets();
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) {
      return { valid: false, message: 'Ticket not found' };
    }

    if (ticket.status === 'used') {
      return { valid: false, message: 'Ticket already used' };
    }

    // Mark as used
    ticket.status = 'used';
    this.saveTickets(tickets);

    return { valid: true, ticket, message: 'Ticket validated successfully' };
  }

  private generateTicketId(): string {
    // Creates a more secure and unique ticket ID with timestamp and random string
    return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUniqueQRCode(eventId: number, userId: number, email: string): string {
    // Generate a unique hash based on eventId, userId, email and current timestamp
    const uniqueData = `E${eventId}U${userId}${email}${Date.now()}`;
    const hash = this.hashString(uniqueData);
    
    // Create a QR code that contains the ticket ID and hash
    // This is just a placeholder - in a real app this would generate an actual QR code
    return `QR-${hash}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(this.ticketsKey, JSON.stringify(tickets));
  }
}

export const ticketService = new TicketService();
