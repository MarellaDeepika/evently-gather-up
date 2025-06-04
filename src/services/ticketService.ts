
export interface Ticket {
  id: string;
  eventId: number;
  userId: number;
  ticketType: 'general' | 'vip' | 'early-bird';
  price: number;
  status: 'active' | 'used' | 'cancelled';
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
      price: eventPrice,
      status: 'active',
      qrCode: this.generateQRCode(),
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

    if (ticket.status === 'cancelled') {
      return { valid: false, message: 'Ticket cancelled' };
    }

    // Mark as used
    ticket.status = 'used';
    this.saveTickets(tickets);

    return { valid: true, ticket, message: 'Ticket validated successfully' };
  }

  // Cancel ticket
  cancelTicket(ticketId: string): boolean {
    const tickets = this.getAllTickets();
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket || ticket.status === 'used') return false;

    ticket.status = 'cancelled';
    this.saveTickets(tickets);
    return true;
  }

  private generateTicketId(): string {
    return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateQRCode(): string {
    // In real app, this would generate actual QR code
    return `QR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveTickets(tickets: Ticket[]): void {
    localStorage.setItem(this.ticketsKey, JSON.stringify(tickets));
  }
}

export const ticketService = new TicketService();
