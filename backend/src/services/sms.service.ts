const africastalking = require('africastalking');

let smsClient: any = null;

const getSmsClient = () => {
  if (!smsClient) {
    const credentials = {
      apiKey: process.env.AT_API_KEY as string,
      username: process.env.AT_USERNAME as string,
    };
    const at = africastalking(credentials);
    smsClient = at.SMS;
  }
  return smsClient;
};

/**
 * Sends a generic SMS message via Africa's Talking Gateway.
 * Converts local 07xx numbers to +256 format if necessary.
 */
export const sendSms = async (to: string, message: string) => {
  try {
    const sms = getSmsClient();
    // Format Ugandan numbers if they start with 0
    let formattedNumber = to.trim();
    if (formattedNumber.startsWith('0') && formattedNumber.length === 10) {
      formattedNumber = `+256${formattedNumber.slice(1)}`;
    } else if (!formattedNumber.startsWith('+')) {
      formattedNumber = `+${formattedNumber}`; // Fallback assuming country code without +
    }

    const options = {
      to: [formattedNumber],
      message: message,
    };

    const response = await sms.send(options);
    console.log(`[SMS Gateway] Dispatched to ${formattedNumber}: ${message}`);
    return response;
  } catch (error) {
    console.error(`[SMS Gateway Error] Failed to send SMS to ${to}:`, error);
    throw new Error('SMS dispatch blocked by gateway provider.');
  }
};

/**
 * Sends a standard 6-digit OTP configuration for Funder 2FA.
 */
export const sendTwoFactorOtp = async (to: string, otp: string) => {
  const message = `WELILE GUARD \nyour security code is ${otp}. It expires in 10 minutes.`;
  return sendSms(to, message);
};
