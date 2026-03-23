import { config } from 'dotenv';
import path from 'path';

// Force load the exact environment file early
config({ path: path.resolve(__dirname, '../.env') });

import { sendTwoFactorOtp } from '../src/services/sms.service';

const testSmsDelivery = async () => {
  console.log(`--- Testing Africa's Talking 2FA OTP Gateway ---`);
  console.log(`Username: ${process.env.AT_USERNAME}`);
  console.log(`API Key: ${process.env.AT_API_KEY ? '****' + process.env.AT_API_KEY.slice(-4) : 'MISSING'}`);
  
  // Explicit terminal execution replicating Account Settings
  const testNumber = '0701355245'; 
  const testOtp = '889922';

  try {
    console.log(`Disarming OTP intercept! Firing SMS payload to ${testNumber}...`);
    const response = await sendTwoFactorOtp(testNumber, testOtp);
    console.log('--- SMS Payload Executed Successfully! ---');
    console.log(response);
    process.exit(0);
  } catch (error) {
    console.error('--- SMS Payload Blocked ---');
    console.error(error);
    process.exit(1);
  }
};

testSmsDelivery();
