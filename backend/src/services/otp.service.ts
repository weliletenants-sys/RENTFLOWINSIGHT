// @ts-ignore
import africastalking from 'africastalking';

const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_API_KEY = process.env.AT_API_KEY || '';

// Initialize Africa's Talking
const at = africastalking({
    apiKey: AT_API_KEY,
    username: AT_USERNAME
});

const sms = at.SMS;

export class OTPService {
    /**
     * Generates a numeric OTP code of a specified length
     */
    static generateCode(length: number = 4): string {
        let code = '';
        for (let i = 0; i < length; i++) {
            code += Math.floor(Math.random() * 10).toString();
        }
        return code;
    }

    /**
     * Sends an SMS message using Africa's Talking
     */
    static async sendSMS(to: string, message: string): Promise<boolean> {
        try {
            // Africa's Talking expects numbers in E.164 international format (+254...)
            // Ensure the 'to' string is properly formatted before calling
            const options = {
                to: [to],
                message: message
            };
            
            const response = await sms.send(options);
            console.log("Africa's Talking Response:", response);
            
            // Basic check if the message was accepted
            if (response.SMSMessageData && response.SMSMessageData.Recipients.length > 0) {
                 return response.SMSMessageData.Recipients[0].statusCode === 101 || response.SMSMessageData.Recipients[0].statusCode === 100 || response.SMSMessageData.Recipients[0].status === 'Success';
            }
            return true;
        } catch (error) {
            console.error("Failed to send SMS via Africa's Talking:", error);
            return false;
        }
    }
}
