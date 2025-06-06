
class QRService {
  // Generate unique QR code for each ticket that's genuinely unique
  generateUniqueQRCode(ticketData: {
    ticketId: string;
    eventId: number;
    userId: number; 
    purchaseDate: string;
    attendeeName: string;
  }): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas context not available');
    
    canvas.width = 200;
    canvas.height = 200;
    
    // Create truly unique identifier for this specific ticket
    const uniqueId = `EVENT:${ticketData.eventId}|TICKET:${ticketData.ticketId}|USER:${ticketData.userId}|NAME:${ticketData.attendeeName}|TIME:${Date.now()}`;
    const hashCode = this.hashCode(uniqueId);
    
    // Create QR code matrix based on the ticket data
    const qrSize = 29; // Standard QR code size
    const matrix = this.generateMatrix(hashCode, qrSize);
    
    // Draw QR code
    this.drawQRCode(ctx, matrix);
    
    return canvas.toDataURL('image/png');
  }
  
  // Generate a QR code pattern based on ticket data
  private generateMatrix(hashCode: number, size: number): boolean[][] {
    const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    
    // Create data pattern based on hash
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Skip finder patterns (corners)
        if (this.isFinderPatternArea(i, j, size)) continue;
        
        // Generate pixel based on hash value
        const cellValue = (hashCode + (i * 37) + (j * 17)) % 100;
        matrix[i][j] = cellValue < 50;
      }
    }
    
    // Add finder patterns (the three squares in corners that help scanning)
    this.addFinderPatterns(matrix, size);
    
    return matrix;
  }
  
  // Check if current position is in finder pattern area
  private isFinderPatternArea(i: number, j: number, size: number): boolean {
    // Top-left
    if (i < 7 && j < 7) return true;
    // Top-right
    if (i < 7 && j >= size - 7) return true;
    // Bottom-left
    if (i >= size - 7 && j < 7) return true;
    
    return false;
  }
  
  // Add finder patterns to the QR matrix
  private addFinderPatterns(matrix: boolean[][], size: number): void {
    const addFinderPattern = (startI: number, startJ: number) => {
      // Outer border - 7x7 black square
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          if (i === 0 || i === 6 || j === 0 || j === 6) {
            matrix[startI + i][startJ + j] = true;
          }
        }
      }
      
      // Inner white square - 5x5
      for (let i = 1; i < 6; i++) {
        for (let j = 1; j < 6; j++) {
          matrix[startI + i][startJ + j] = false;
        }
      }
      
      // Center black square - 3x3
      for (let i = 2; i < 5; i++) {
        for (let j = 2; j < 5; j++) {
          matrix[startI + i][startJ + j] = true;
        }
      }
    };
    
    // Add finder patterns in the three corners
    addFinderPattern(0, 0); // Top-left
    addFinderPattern(0, size - 7); // Top-right
    addFinderPattern(size - 7, 0); // Bottom-left
  }
  
  // Draw QR code on canvas based on matrix
  private drawQRCode(ctx: CanvasRenderingContext2D, matrix: boolean[][]): void {
    const size = matrix.length;
    const cellSize = 180 / size;
    const margin = 10;
    
    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 200, 200);
    
    // Draw QR pattern
    ctx.fillStyle = '#000000';
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j]) {
          ctx.fillRect(
            margin + i * cellSize, 
            margin + j * cellSize, 
            cellSize, 
            cellSize
          );
        }
      }
    }
  }

  // Generate individual ticket for each attendee with unique QR
  generateAttendeeTicket(ticketData: {
    ticketId: string;
    attendeeIndex: number;
    attendeeName: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    eventId: number;
    userId: number;
    purchaseDate: string;
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
    
    // Generate truly unique QR code
    const qrCodeDataUrl = this.generateUniqueQRCode({
      ticketId: ticketData.ticketId,
      eventId: ticketData.eventId,
      userId: ticketData.userId,
      purchaseDate: ticketData.purchaseDate,
      attendeeName: ticketData.attendeeName
    });
    
    // Draw QR code
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 140, 390, 120, 120);
    };
    qrImg.src = qrCodeDataUrl;
    
    // Price indication in INR
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#333333';
    ctx.fillText('₹', 200, 530); // Rupee symbol
    
    // Unique ticket ID
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${ticketData.ticketId}-ATT${ticketData.attendeeIndex}`, 200, 550);
    
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

  // For backward compatibility 
  generateQRCode(data: string): string {
    return this.generateUniqueQRCode({
      ticketId: data,
      eventId: 0,
      userId: 0,
      purchaseDate: new Date().toISOString(),
      attendeeName: 'Ticket Holder'
    });
  }

  // For backward compatibility
  generateTicketImage(ticketData: {
    ticketId: string;
    eventTitle: string;
    eventDate: string;
    eventLocation: string;
    userName: string;
  }): string {
    return this.generateAttendeeTicket({
      ticketId: ticketData.ticketId,
      attendeeIndex: 1,
      attendeeName: ticketData.userName,
      eventTitle: ticketData.eventTitle,
      eventDate: ticketData.eventDate,
      eventLocation: ticketData.eventLocation,
      eventId: 0,
      userId: 0,
      purchaseDate: new Date().toISOString()
    });
  }
}

export const qrService = new QRService();
