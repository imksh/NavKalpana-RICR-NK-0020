import sendEmail from "../config/email.js";

const sendNewsletterEmail = async (to, subject, message, unsubscribeToken) => {
  try {
    const unsubscribeUrl = `https://maa-baglamukhi-mandir.onrender.com/api/public/newsletter/unsubscribe?token=${unsubscribeToken}`;

    const template = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
    <tr>
      <td align="center" style="padding:25px;">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;"
        >

          <!-- HEADER -->
          <tr>
            <td style="background:#f57c00;color:#ffffff;padding:20px 25px;">
              <h2 style="margin:0;">📢 Newsletter</h2>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:25px;color:#333;">
              <h3 style="margin-top:0;">${subject}</h3>

              <p style="font-size:15px;line-height:1.7;">
                ${message.replace(/\n/g, "<br/>")}
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="background:#f1f5f9;padding:18px;text-align:center;font-size:12px;color:#666;"
            >
              © ${new Date().getFullYear()} Maa Baglamukhi Mandir<br/>
              You’re receiving this email because you subscribed.<br/><br/>

              <a
                href="${unsubscribeUrl}"
                style="color:#ef4444;text-decoration:none;font-weight:bold;"
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
