
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: string;
    encoding: string;
  }[];
}

class EmailService {
  // Simulate email sending (in production, you'd use a real email service)
  async sendEmail(emailData: EmailData): Promise<boolean> {
    console.log('📧 Sending email:', emailData);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, you would integrate with:
    // - SendGrid
    // - Mailgun
    // - AWS SES
    // - etc.
    
    return true;
  }

  async sendBookingConfirmation(
    userEmail: string,
    userName: string,
    eventTitle: string,
    eventDate: string,
    eventLocation: string,
    ticketId: string,
    qrCodeDataUrl: string
  ): Promise<boolean> {
    const emailHtml = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎟️ Booking Confirmed!</h1>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333;">Hello ${userName}!</h2>
          <p style="color: #666; font-size: 16px;">
            Your ticket for <strong>${eventTitle}</strong> has been confirmed.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Event Details</h3>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Location:</strong> ${eventLocation}</p>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
          </div>
          
          <p style="color: #666;">
            Your QR code ticket is attached to this email. Please present it at the event entrance.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="${qrCodeDataUrl}" alt="QR Code Ticket" style="border: 1px solid #ddd; padding: 10px; background: white;"/>
          </div>
          
          <p style="color: #999; font-size: 14px;">
            Thank you for using Evently! We hope you enjoy the event.
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `🎟️ Your ticket for ${eventTitle}`,
      html: emailHtml,
      attachments: [
        {
          filename: `ticket-${ticketId}.png`,
          content: qrCodeDataUrl.split(',')[1], // Remove data:image/png;base64, prefix
          encoding: 'base64'
        }
      ]
    });
  }
}

export const emailService = new EmailService();
