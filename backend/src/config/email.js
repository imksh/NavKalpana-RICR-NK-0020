import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Gradify" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
