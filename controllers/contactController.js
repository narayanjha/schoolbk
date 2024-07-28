const nodemailer = require("nodemailer");
const config = require("../config/config");
const contactUs = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    const transporter = nodemailer.createTransport(config.smtpConfig);
    const mailOption = {
      from: config.smtpConfig.auth.user,
      to: email,
      subject: "Contact Form Submission",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Form Submission</title>
            <style>
            body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
            .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #ddd; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 20px 0; }
            .content p { line-height: 1.6; }
            .footer { text-align: center; padding-top: 20px; border-top: 1px solid #ddd; color: #777; }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h1>Contact Form Submission</h1>
            </div>
            <div class="content">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Developed By Narayan Jha. All rights reserved.</p>
            </div>
            </div>
        </body>
        </html>
      `,
    };
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { contactUs };
