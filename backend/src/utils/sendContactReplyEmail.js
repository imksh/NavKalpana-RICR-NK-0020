import sendEmail from "../config/email.js";

const sendContactReplyEmail = async (to, userName, adminMessage) => {
  try {
    const template = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,sans-serif;">

  <!-- outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
    <tr>
      <td align="center" style="padding:25px;">

        <!-- main container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;"
        >

          <!-- header -->
          <tr>
            <td style="background:#f57c00;color:#ffffff;padding:20px 25px;">
              <h2 style="margin:0;">📩 Contact Response</h2>
            </td>
          </tr>

          <!-- content -->
          <tr>
            <td style="padding:25px;color:#333;">
              <p style="font-size:15px;">
                Hello ${userName || "User"},
              </p>

              <p style="font-size:15px;line-height:1.7;">
                Thank you for contacting <strong>Maa Baglamukhi Mandir</strong>.
              </p>

              <p style="font-size:15px;line-height:1.7;">
                ${adminMessage.replace(/\n/g, "<br/>")}
              </p>

              <p style="margin-top:25px;font-size:15px;">
                Regards,<br/>
                <strong>Maa Baglamukhi Mandir Team</strong>
              </p>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="background:#f1f5f9;padding:15px;text-align:center;font-size:12px;color:#666;">
              © ${new Date().getFullYear()} Maa Baglamukhi Mandir<br/>
              This is a response to your contact request.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

    await sendEmail(to, "Reply from Maa Baglamukhi Mandir", template);
  } catch (error) {
    console.error("Contact reply email error:", error);
    throw error;
  }
};

export default sendContactReplyEmail;
