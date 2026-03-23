import https from 'https';
import querystring from 'querystring';

const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_API_KEY  = process.env.AT_API_KEY  || '';

// Africa's Talking REST SMS endpoint
// POST https://api.africastalking.com/version1/messaging
// Headers: apiKey, Accept: application/json, Content-Type: application/x-www-form-urlencoded
// Body params: username, to (comma-separated E.164 numbers), message, [from]

/**
 * Normalise a phone number to E.164 format required by Africa's Talking.
 * Handles Ugandan (0xxx → +256xxx) and already-international (+xxx) numbers.
 */
function toE164(phone: string): string {
  const stripped = phone.trim().replace(/[\s\-()]/g, '');
  if (stripped.startsWith('+')) return stripped;          // already E.164
  if (stripped.startsWith('0')) return '+256' + stripped.slice(1); // 0772… → +256772…
  return '+' + stripped;                                  // assume country code present
}

export class OTPService {

  /**
   * Generates a numeric OTP of the given length.
   */
  static generateCode(length: number = 6): string {
    let code = '';
    for (let i = 0; i < length; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  }

  /**
   * Sends an SMS via the Africa's Talking REST API.
   * Reference: POST https://api.africastalking.com/version1/messaging
   *
   * Required headers:
   *   apiKey: <AT_API_KEY>
   *   Accept: application/json
   *   Content-Type: application/x-www-form-urlencoded
   *
   * Required body fields:
   *   username – your AT username (e.g. "RentFlowApp")
   *   to       – comma-separated E.164 phone numbers
   *   message  – SMS body text
   *
   * Optional:
   *   from     – approved sender ID (omit to use shared short code)
   */
  static async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      const e164 = toE164(to);

      const body = querystring.stringify({
        username: AT_USERNAME,
        to:       e164,
        message:  message,
        // from: 'RentFlow',  // Uncomment once your sender ID is approved in AT dashboard
      });

      const options: https.RequestOptions = {
        hostname: 'api.africastalking.com',
        path:     '/version1/messaging',
        method:   'POST',
        headers: {
          'apiKey':         AT_API_KEY,
          'Accept':         'application/json',
          'Content-Type':   'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body),
        },
      };

      const response = await new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body: data }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
      });

      const parsed = JSON.parse(response.body);
      console.log("[AT SMS] Status:", response.statusCode, "| Response:", JSON.stringify(parsed));

      // AT returns SMSMessageData.Recipients[].status === "Success" on success
      const recipients: any[] = parsed?.SMSMessageData?.Recipients ?? [];
      if (recipients.length === 0) {
        console.warn('[AT SMS] No recipients in response — message may not have been delivered.');
        return false;
      }

      const recipient = recipients[0];
      const success = recipient.status === 'Success' || recipient.statusCode === 101 || recipient.statusCode === 100;
      if (!success) {
        console.warn(`[AT SMS] Delivery failed for ${e164}: status="${recipient.status}" code=${recipient.statusCode}`);
      }
      return success;

    } catch (error) {
      console.error("[AT SMS] Error sending SMS:", error);
      return false;
    }
  }
}
