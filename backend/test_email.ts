import nodemailer from 'nodemailer';

async function sendTestEmail() {
  console.log('Starting Titan SMTP test...');

  const transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true, // SSL
    auth: {
      user: 'info@welile.com',
      pass: 'Welile@Tech2026', // rotate it first
    },
    connectionTimeout: 20000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    logger: true,
    debug: true,
  });

  try {
    // STEP 1: Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection successful');

    // STEP 2: Send email
    const info = await transporter.sendMail({
      from: '"Welile" <info@welile.com>',
      to: 'pexpert46@gmail.com',
      subject: 'Titan SMTP Test ✔',
      text: 'Plain text test',
      html: '<b>HTML test</b>',
    });

    console.log('Message sent:', info.messageId);
    console.log('Server response:', info.response);

  } catch (error) {
    console.error('FULL ERROR OBJECT ↓↓↓');
    console.error(error);

    console.error('\nParsed details:');
    console.error('code:', error.code);
    console.error('response:', error.response);
    console.error('responseCode:', error.responseCode);
    console.error('command:', error.command);
  }
}

sendTestEmail();