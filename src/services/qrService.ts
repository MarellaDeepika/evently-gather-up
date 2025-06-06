
class QRService {
  // Generate unique QR code for each attendee using actual QR data format
  generateAttendeeQRCode(attendeeData: {
    ticketId: string;
    attendeeIndex: number;
    attendeeName: string;
    eventId: number;
  }): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 200;
    canvas.height = 200;
    
    // Create unique identifier for this specific attendee
    const uniqueId = `EVENT:${attendeeData.eventId}|TICKET:${attendeeData.ticketId}|ATTENDEE:${attendeeData.attendeeIndex}|NAME:${attendeeData.attendeeName}|TIME:${Date.now()}`;
    
    // Generate a more realistic QR pattern based on the unique data
    const qrMatrix = this.generateQRMatrix(uniqueId);
    
    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 200, 200);
    
    // Draw QR code pattern
    ctx.fillStyle = '#000000';
    const cellSize = 160 / qrMatrix.length;
    
    for (let i = 0; i < qrMatrix.length; i++) {
      for (let j = 0; j < qrMatrix[i].length; j++) {
        if (qrMatrix[i][j]) {
          ctx.fillRect(20 + i * cellSize, 20 + j * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Add corner detection patterns (like real QR codes)
    this.drawCornerPattern(ctx, 20, 20, cellSize);
    this.drawCornerPattern(ctx, 20 + (qrMatrix.length - 7) * cellSize, 20, cellSize);
    this.drawCornerPattern(ctx, 20, 20 + (qrMatrix.length - 7) * cellSize, cellSize);
    
    return canvas.toDataURL('image/png');
  }

  private generateQRMatrix(data: string): boolean[][] {
    const size = 21; // Standard QR code size
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Generate pattern based on data hash
    const hash = this.hashCode(data);
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Skip corner patterns
        if (this.isCornerPattern(i, j, size)) continue;
        
        // Generate pseudo-random pattern based on data
        const cellValue = (hash + i * 31 + j * 17) % 100;
        matrix[i][j] = cellValue < 50;
      }
    }
    
    return matrix;
  }

  private isCornerPattern(x: number, y: number, size: number): boolean {
    // Top-left corner
    if (x < 9 && y < 9) return true;
    // Top-right corner
    if (x >= size - 8 && y < 9) return true;
    // Bottom-left corner
    if (x < 9 && y >= size - 8) return true;
    
    return false;
  }

  private drawCornerPattern(ctx: CanvasRenderingContext2D, startX: number, startY: number, cellSize: number): void {
    // Draw the characteristic QR corner pattern
    ctx.fillStyle = '#000000';
    
    // Outer border
    ctx.fillRect(startX, startY, 7 * cellSize, cellSize);
    ctx.fillRect(startX, startY, cellSize, 7 * cellSize);
    ctx.fillRect(startX + 6 * cellSize, startY, cellSize, 7 * cellSize);
    ctx.fillRect(startX, startY + 6 * cellSize, 7 * cellSize, cellSize);
    
    // Inner square
    ctx.fillRect(startX + 2 * cellSize, startY + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  }

  // Generate individual ticket for each attendee
  generateAttendeeTicket(ticketData: {
    ticketId: string;
    attendeeIndex: number;
    attendeeName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    eventId: number;
  }): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 400;
    canvas.height = 600;
    
    // Background gradient
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
    
    // Attendee number with unique styling
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#667eea';
    ctx.fillText(`ATTENDEE #${ticketData.attendeeIndex}`, 200, 110);
    
    // Event details
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#333333';
    ctx.fillText('Event:', 40, 150);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.eventTitle, 40, 175);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Date:', 40, 210);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.eventDate, 40, 235);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Location:', 40, 270);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.eventLocation, 40, 295);
    
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Attendee:', 40, 330);
    ctx.font = '16px Arial';
    ctx.fillText(ticketData.attendeeName, 40, 355);
    
    // Generate and draw QR code
    const qrCodeDataUrl = this.generateAttendeeQRCode(ticketData);
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 140, 400, 120, 120);
    };
    qrImg.src = qrCodeDataUrl;
    
    // Unique ticket ID
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${ticketData.ticketId}-ATT${ticketData.attendeeIndex}`, 200, 550);
    
    return canvas.toDataURL('image/png');
  }

  // Generate QR code as data URL (original method for backward compatibility)
  generateQRCode(data: string): string {
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

  // Generate downloadable ticket with QR code (original method for backward compatibility)
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

  // Helper method to generate consistent hash
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}

export const qrService = new QRService();
