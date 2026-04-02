require('dotenv').config();
const africastalking = require('africastalking');

async function main() {
  const number = '0701355245';
  console.log(`Sending test SMS to ${number}...`);
  try {
    const credentials = {
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME,
    };
    
    if (!credentials.apiKey) {
      console.log('Error: AT_API_KEY is not set in .env');
      return;
    }

    const at = africastalking(credentials);
    const sms = at.SMS;
    
    let formattedNumber = `+256${number.slice(1)}`;
    
    const options = {
      to: [formattedNumber],
      message: 'Hello! This is a test message from Welile Express Backend to verify SMS API connectivity.',
    };

    const response = await sms.send(options);
    console.log('Response from AfricasTalking:');
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('Error during sendSms execution:', err);
  }
}

main();
