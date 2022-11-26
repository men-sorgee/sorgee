import client from '@sendgrid/client';
import mail from '@sendgrid/mail';

export const lists = {
  subscribers: 'fdfecde5-2787-499a-a879-955959fc9720'
}

export async function addSubscriber(
  first_name: string, email: string): Promise<string> {

  client.setApiKey(process.env.SENDGRID_API_KEY);
  

  let [, data] = await client.request({
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: {
      list_ids: [lists.subscribers],
      contacts: [{ email, first_name }]
    }
  });

  return data
}

export async function sendEmail(
  to: string,
  subject: string) {
  mail.setApiKey(process.env.SENDGRID_API_KEY);
  mail
    .send({
      to,
      from: 'system@guysnheat.com',
      subject,
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

export async function sendApplicationWorkflowEmail(
  to: string,
  title: string,
  message: string,
  button_text: string = "Continue Application",
  button_url: string = "",
  ) {
  mail.setApiKey(process.env.SENDGRID_API_KEY);
  await mail
    .send({
      from: 'GuysNHeat <system@guysnheat.com>',
      to,
      subject: title,
      dynamicTemplateData: {
        subject: title,
        title,
        message,
        button_text,
        button_url
      },
      templateId: 'd-7fe0a94b7c0b40b2a68b5d998ee6f7af'
    })
}