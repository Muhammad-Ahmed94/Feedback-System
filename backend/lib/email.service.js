import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Use app password for Gmail
    },
  });
};

// Send verification email
export const sendVerificationEmail = async (email, verificationToken, anonymousName) => {
  const transporter = createTransporter();
  
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: `"Smart Insight System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - Smart Insight',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4A90E2; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
            .button { display: inline-block; padding: 12px 30px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            .anonymous-id { background-color: #e8f4f8; padding: 10px; border-left: 4px solid #4A90E2; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Smart Insight</h1>
            </div>
            <div class="content">
              <h2>Email Verification Required</h2>
              <p>Thank you for signing up for our anonymous feedback system!</p>
              
              <div class="anonymous-id">
                <strong>Your Anonymous Identity:</strong><br>
                <span style="font-size: 18px; color: #4A90E2;">${anonymousName}</span><br>
                <small style="color: #666;">This is how you'll be identified in the system. Your real identity remains completely anonymous and untraceable.</small>
              </div>
              
              <p>To complete your registration and access the feedback system, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4A90E2;">${verificationUrl}</p>
              
              <p><strong>Important:</strong></p>
              <ul>
                <li>This link will expire in 24 hours</li>
                <li>You must verify your email before accessing the feedback system</li>
                <li>Your identity is completely anonymized for maximum privacy</li>
              </ul>
              
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Smart Insight. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome to Smart Insight!
      
      Your Anonymous Identity: ${anonymousName}
      
      Please verify your email address by visiting:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create this account, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, anonymousName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Smart Insight System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Smart Insight - Email Verified',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Email Verified Successfully</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${anonymousName}!</h2>
              <p>Your email has been verified successfully. You can now access the Smart Insight feedback system.</p>
              
              <p><strong>What you can do now:</strong></p>
              <ul>
                <li>Submit anonymous feedback</li>
                <li>View feedback insights</li>
                <li>Participate in the feedback system with complete anonymity</li>
              </ul>
              
              <p>Remember: Your identity (${anonymousName}) is completely anonymized and cannot be traced back to your real identity.</p>
              
              <p>Thank you for being part of Smart Insight!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Smart Insight. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
  }
};