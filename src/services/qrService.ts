
class QRService {
  // Generate QR code as data URL
  generateQRCode(data: string): string {
    // In a real app, you'd use a QR code library like 'qrcode'
    // For now, we'll create a simple visual representation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 200;
    canvas.height = 200;
    
    // Create a simple pattern that represents QR code
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 200, 200);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(10, 10, 180, 180);
    
    ctx.fillStyle = '#000000';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    
    // Add some QR-like pattern
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(20 + i * 16, 20 + j * 16, 14, 14);
        }
      }
    }
    
    // Add ticket ID as text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(50, 160, 100, 20);
    ctx.fillStyle = '#000000';
    ctx.fillText(data.substring(0, 12), 100, 175);
    
    return canvas.toDataURL('image/png');
  }

  // Generate downloadable ticket with QR code
  generateTicketImage(ticketData: {
    ticketId: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    userName: string;
  }): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 400;
    canvas.height = 600;
    
    // Background
    const gradient = ctx.createLinearGradient(0, 0, 400, 600);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);
    
    // White ticket background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(20, 20, 360, 560);
    
    // Header
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎟️ EVENT TICKET', 200, 80);
    
    // Event details
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Event:', 40, 140);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.eventTitle, 40, 165);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Date:', 40, 210);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.eventDate, 40, 235);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Location:', 40, 280);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.eventLocation, 40, 305);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Attendee:', 40, 350);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.userName, 40, 375);
    
    // QR Code area
    ctx.fillStyle = '#000000';
    ctx.fillRect(140, 420, 120, 120);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(145, 425, 110, 110);
    
    // QR pattern
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillRect(150 + i * 12, 430 + j * 12, 10, 10);
        }
      }
    }
    
    // Ticket ID
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ticketData.ticketId, 200, 560);
    
    return canvas.toDataURL('image/png');
  }

  // Download ticket as PNG
  downloadTicket(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const qrService = new QRService();
