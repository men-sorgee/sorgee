import twilio from 'twilio'

const config = {
  twilioSid: process.env.TWILIO_SID || 'AC8581eae8d3c89559f3eaf62f6e206d2b',
  twilioToken: process.env.TWILIO_TOKEN,
  twilioNumber: process.env.TWILIO_NUMBER || '+17207249426',
}

export async function sendNotification(phone: string, message: string) {
  const client = twilio(config.twilioSid, config.twilioToken)
  const result = await client.messages.create({
    body: message,
    from: config.twilioNumber,
    to: phone,
  })
  return result
}
