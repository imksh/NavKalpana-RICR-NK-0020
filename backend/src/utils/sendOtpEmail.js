import sendEmail from "../config/email.js";

const sendOtpEmail = async (to, otp) => {
  const subject = "OTP to reset your Gradify password";

  const message = `
  <body style="margin:0; padding:0; background:#f4f6f8; font-family:Arial, sans-serif;">

    <div style="max-width:500px; margin:40px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 20px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:#4f46e5; padding:22px; text-align:center;">
        <h2 style="color:#ffffff; margin:0; font-weight:600;">Gradify Security</h2>
      </div>

      <!-- Content -->
      <div style="padding:32px; color:#1f2937;">
        <p style="font-size:16px; margin-bottom:12px;">Hello,</p>

        <p style="font-size:15px; line-height:1.6; color:#374151;">
          We received a request to reset your password.
          Use the OTP below to continue. This code is valid for 
          <strong>10 minutes</strong>.
        </p>

        <div style="text-align:center; margin:35px 0;">
          <span style="
            display:inline-block;
            font-size:30px;
            letter-spacing:8px;
            padding:16px 36px;
            background:#eef2ff;
            border-radius:10px;
            font-weight:700;
            color:#111827;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px; color:#6b7280;">
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p style="margin-top:30px; font-size:14px; color:#374151;">
          — Team Gradify
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#9ca3af;">
        © 2026 Gradify. All rights reserved.
      </div>

    </div>

  </body>
  `;

  await sendEmail(to, subject, message);
};

export default sendOtpEmail;