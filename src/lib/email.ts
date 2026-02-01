import * as brevo from '@getbrevo/brevo'

const apiInstance = new brevo.TransactionalEmailsApi()

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || ''
)

interface EmailOptions {
  to: string
  toName?: string
  subject: string
  htmlContent: string
  textContent?: string
}

export async function sendEmail({ to, toName, subject, htmlContent, textContent }: EmailOptions) {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured, skipping email')
    return { success: false, error: 'Email not configured' }
  }

  const sendSmtpEmail = new brevo.SendSmtpEmail()
  
  sendSmtpEmail.sender = {
    name: 'Compass Lost & Found',
    email: process.env.BREVO_SENDER_EMAIL || 'noreply@compass.app'
  }
  
  sendSmtpEmail.to = [{
    email: to,
    name: toName || to.split('@')[0]
  }]
  
  sendSmtpEmail.subject = subject
  sendSmtpEmail.htmlContent = htmlContent
  sendSmtpEmail.textContent = textContent || htmlContent.replace(/<[^>]*>/g, '')

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
    console.log('Email sent successfully:', result)
    return { success: true, messageId: result.body?.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: String(error) }
  }
}

function getEmailHeader(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #132A13; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
  
  <!-- Styled Logo Header -->
  <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td style="text-align: center;">
          <div style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid #4F772D; margin: 0 auto 15px auto; line-height: 54px; text-align: center;">
            <span style="font-size: 28px;">🧭</span>
          </div>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <h1 style="color: #4F772D; margin: 0; font-size: 32px; font-weight: 400; letter-spacing: 3px; font-family: Georgia, serif;">Compass</h1>
        </td>
      </tr>
      <tr>
        <td style="text-align: center;">
          <p style="color: #6b7c5c; margin: 5px 0 0 0; font-size: 13px; letter-spacing: 1px;">LOST & FOUND</p>
        </td>
      </tr>
    </table>
  </div>
  `
}

function getEmailFooter(): string {
  return `
  <div style="text-align: center; color: #6b7c5c; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ECF39E;">
    <p style="margin: 0;">Thank you for using Compass!</p>
    <p style="margin-top: 15px; font-size: 12px;">© ${new Date().getFullYear()} Compass Lost & Found</p>
  </div>
</body>
</html>
  `
}

export function generateItemClaimedEmail(itemTitle: string, claimantName: string) {
  const htmlContent = `${getEmailHeader()}
  <div style="background: #f8faf5; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #132A13; margin-top: 0;">Great News! Someone Claimed Your Item</h2>
    
    <p>Someone has submitted a claim for the item you reported:</p>
    
    <div style="background: white; border: 2px solid #ECF39E; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <strong style="color: #4F772D; font-size: 18px;">${itemTitle}</strong>
    </div>
    
    <p><strong>Claimant:</strong> ${claimantName}</p>
    
    <p>Our admin team is currently reviewing this claim to verify ownership. You'll receive another notification once the claim has been processed.</p>
  </div>
  ${getEmailFooter()}`
  
  return {
    subject: `Claim Submitted for "${itemTitle}"`,
    htmlContent
  }
}

export function generateItemApprovedEmail(itemTitle: string) {
  const htmlContent = `${getEmailHeader()}
  <div style="background: #f8faf5; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #132A13; margin-top: 0;">✅ Your Item Has Been Approved!</h2>
    
    <p>Good news! The item you reported has been reviewed and approved by our admin team:</p>
    
    <div style="background: white; border: 2px solid #ECF39E; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <strong style="color: #4F772D; font-size: 18px;">${itemTitle}</strong>
    </div>
    
    <p>Your item is now visible to the school community. If someone recognizes it as theirs, they can submit a claim through our system.</p>
    
    <p>We'll notify you when someone submits a claim for this item.</p>
  </div>
  ${getEmailFooter()}`
  
  return {
    subject: `Your Item "${itemTitle}" Has Been Approved`,
    htmlContent
  }
}

export function generateClaimVerifiedEmail(itemTitle: string, claimantName: string) {
  const htmlContent = `${getEmailHeader()}
  <div style="background: #f8faf5; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
    <h2 style="color: #132A13; margin-top: 0;">🎉 Item Successfully Returned!</h2>
    
    <p>Great news! The claim for the following item has been verified:</p>
    
    <div style="background: white; border: 2px solid #ECF39E; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <strong style="color: #4F772D; font-size: 18px;">${itemTitle}</strong>
    </div>
    
    <p>The item has been returned to <strong>${claimantName}</strong>.</p>
    
    <p>Thank you for reporting this found item and helping someone get their belongings back! You made a difference today.</p>
  </div>
  ${getEmailFooter()}`
  
  return {
    subject: `"${itemTitle}" Has Been Returned to Its Owner`,
    htmlContent
  }
}
