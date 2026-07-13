export function generateOtp() {
  // 6-digit OTP: 100000–999999
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// So when u send emails the entire email goes as an html format inside that html format somewhere we send the otp

export function getOtpHtml(otp) {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  });

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Your Verification Code</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f2f4f7; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }

  @media screen and (max-width: 600px) {
    .email-container { width: 100% !important; }
    .fluid-padding { padding-left: 24px !important; padding-right: 24px !important; }
    .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f2f4f7;">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
  Your one-time verification code for Asjad Bank &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f7;">
  <tr>
    <td align="center" style="padding: 40px 16px;">

      <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 10px rgba(16,24,64,0.06);">

        <!-- Header -->
        <tr>
          <td style="background-color:#0b1e3d; padding: 28px 40px;" class="fluid-padding">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="left" style="font-size:20px; font-weight:700; color:#ffffff; font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; letter-spacing:0.5px;">
                  ASJAD <span style="color:#4a90e2;">BANK</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Accent bar -->
        <tr>
          <td style="height:4px; background:linear-gradient(90deg, #4a90e2 0%, #0b1e3d 100%); font-size:0; line-height:0;">&nbsp;</td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 40px 40px 24px 40px;" class="fluid-padding">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:22px; font-weight:700; color:#0b1e3d; padding-bottom:12px;">
                  Verify Your Identity
                </td>
              </tr>
              <tr>
                <td style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; color:#4b5563; padding-bottom:28px;">
                  Hi there,<br>
                  Use the One-Time Password (OTP) below to complete your verification. This code is valid for the next <strong style="color:#0b1e3d;">10 minutes</strong>.
                </td>
              </tr>
            </table>

            <!-- OTP Box -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="background-color:#f6f8fc; border:1px dashed #c7d2e3; border-radius:10px; padding:28px 20px;">
                  <div class="otp-code" style="font-family:'Courier New', Courier, monospace; font-size:40px; font-weight:700; letter-spacing:14px; color:#0b1e3d;">
                    ${otp}
                  </div>
                  <div style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:13px; color:#8b95a5; margin-top:12px;">
                    Expires at ${expiresAt} IST
                  </div>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; color:#4b5563; padding-top:28px;">
                  Never share this code with anyone, including Asjad Bank staff. If you didn't request this code, you can safely ignore this email or contact our support team immediately.
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td style="padding: 0 40px;" class="fluid-padding">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="border-top:1px solid #eef1f6; font-size:0; line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 40px 36px 40px;" class="fluid-padding">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#9aa3b2;">
                  This is an automated message from Asjad. Please do not reply to this email.<br>
                  &copy; 2026 Asjad. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
</body>
</html>`;
}
