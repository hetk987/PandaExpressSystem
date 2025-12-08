import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Lazy initialization to avoid build-time errors
let twilioClient: twilio.Twilio | null = null;

function getClient(): twilio.Twilio {
    if (!twilioClient) {
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials not configured');
        }
        twilioClient = twilio(accountSid, authToken);
    }
    return twilioClient;
}

/**
 * Format phone number to E.164 format for Twilio
 * Assumes US numbers if no country code provided
 */
function formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Add US country code if not present
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
        cleaned = '1' + cleaned;
    }
    
    // Add + prefix for E.164 format
    return '+' + cleaned;
}

/**
 * Send order ready SMS notification when kitchen completes order
 */
export async function sendOrderReadyNotification(
    phoneNumber: string,
    orderId: number
): Promise<boolean> {
    try {
        if (!twilioPhoneNumber) {
            console.error('Twilio phone number not configured');
            return false;
        }

        const client = getClient();
        const formattedPhone = formatPhoneNumber(phoneNumber);
        
        await client.messages.create({
            body: `🥡 Panda Express: Your order #${orderId} is READY for pickup! Come grab it while it's hot! 🔥`,
            from: twilioPhoneNumber,
            to: formattedPhone,
        });
        
        console.log(`Order ready SMS sent to ${formattedPhone} for order #${orderId}`);
        return true;
    } catch (error) {
        console.error('Failed to send order ready SMS:', error);
        return false;
    }
}

