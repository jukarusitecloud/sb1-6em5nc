import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const emailService = {
  async sendVerificationEmail(email, fullName, verificationToken) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      const msg = {
        to: email,
        from: 'noreply@medicalrecords.com',
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamic_template_data: {
          fullName,
          verificationUrl,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      };

      const response = await sgMail.send(msg);
      console.log('Email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('認証メールの送信に失敗しました');
    }
  }
};