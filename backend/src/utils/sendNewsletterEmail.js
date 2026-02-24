import sendEmail from "../config/email.js";

const sendNewsletterEmail = async (to, subject, message, unsubscribeToken) => {
  try {
    const unsubscribeUrl = `https://imksh-gradify.netlify.app/unsubscribe?token=${unsubscribeToken}`;

    const template = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f3f4f6">
    <tr>
      <td align="center" style="padding:30px 15px;">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.05);"
        >

          <!-- HEADER -->
          <tr>
            <td style="background:#4f46e5;color:#ffffff;padding:24px 30px;">
              <h2 style="margin:0;font-weight:600;">📢 Gradify Newsletter</h2>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:30px;color:#1f2937;">
              <h3 style="margin-top:0;font-weight:600;">${subject}</h3>

              <p style="font-size:15px;line-height:1.8;color:#374151;">
                ${message.replace(/\n/g, "<br/>")}
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#6b7280;"
            >
              © ${new Date().getFullYear()} Gradify. All rights reserved.<br/>
              You are receiving this email because you subscribed to Gradify updates.<br/><br/>

              <a
                href="${unsubscribeUrl}"
                style="color:#ef4444;text-decoration:none;font-weight:600;"
              >
                Unsubscribe
              </a>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    await sendEmail(to, subject, template);
  } catch (error) {
    console.error("Newsletter email error:", error);
    throw error;
  }
};

export default sendNewsletterEmail;