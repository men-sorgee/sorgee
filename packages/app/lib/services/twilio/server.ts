import twilio from 'twilio'

export async function sendNotification(phone: string, message: string) {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: phone,
  })
  return result
}
