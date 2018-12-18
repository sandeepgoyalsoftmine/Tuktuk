import nodemailer from 'nodemailer';


export function sendMail(emailSubject, emailBody, email, attachmentImages) {
  let transporter = nodemailer.createTransport(
    {
      host: 'smtp.1and1.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth:
        {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
    });
  console.log("Email Body: Message:"+emailBody);
  let mailOptions =
    {
      from: process.env.EMAIL_USER,
      to: `${email}`,
      subject: emailSubject,
      text: 'TukTuk Email',
      html: emailBody,
      attachments: attachmentImages
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("UTIL: Error sending email:"+JSON.stringify(error));
      return;
    }
    console.log("UTIL: Message:"+info.messageId+", sent:"+JSON.stringify(info.response));
  });
}
