const config = require("../config/config");
const nodemailer = require("nodemailer");
const sendLoginDetail = async (req, res) => {
  console.log(req);
  const { loginID, password, firstName, lastName, email } = req;
  const { hostName } = "http://localhost:4200";
  const { appName } = "www.school.com";
  try {
    const transporter = nodemailer.createTransport(config.smtpConfig);
    const mailOption = {
      from: config.smtpConfig.auth.user,
      to: email,
      subject: "Login Details for www.school.com",
      html: `
          <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Details for ${appName}</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                }
                .container {
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
                }
                .header h1 {
                margin: 0;
                font-size: 24px;
                }
                .content {
                padding: 20px 0;
                }
                .content p {
                line-height: 1.6;
                }
                .details {
                background-color: #f9f9f9;
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                margin: 20px 0;
                }
                .details p {
                margin: 5px 0;
                }
                .button {
                display: block;
                width: 200px;
                margin: 20px auto;
                padding: 10px;
                text-align: center;
                background-color: #007BFF;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                }
                .footer {
                text-align: center;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                color: #777;
                }
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                <h1>Welcome to [Your App Name]</h1>
                </div>
                <div class="content">
                <p>Hello ${firstName} ${lastName},</p>
                <p>Your account has been successfully created. Here are your login details:</p>
                <div class="details">
                    <p><strong>Login ID:</strong> ${loginID}</p>
                    <p><strong>Password:</strong> ${password}</p>
                </div>
                <p>Please click the button below to log in to your account:</p>
                <a href="http://localhost:4200/" class="button">Log In</a>
                <p>If you did not create an account or have any questions, please contact our support team.</p>
                <p>Thank you, <br> Administrator</p>
                </div>
                <div class="footer">
                <p>&copy; 2024 Developed by Narayan. All rights reserved.</p>
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

module.exports = sendLoginDetail;
