import dotenv from 'dotenv';
import { sendSms } from './src/services/sms.service';

dotenv.config();

async function main() {
  const number = '0701355245';
  console.log(`Sending test SMS to ${number}...`);
  try {
    const response = await sendSms(number, 'Hello! This is a test message from Welile Express Backend to verify SMS API connectivity.');
    console.log('Response from AfricasTalking:');
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error('Error during sendSms execution:', err);
  }
}

main();
