import client from '@sendgrid/client';
import mail from '@sendgrid/mail';
import { MemberLevel } from '../directus';

export enum SendGridList {
  Subscribers = 'fdfecde5-2787-499a-a879-955959fc9720',
  Members = '44971668-1ee8-4f9e-834a-abd5c65a4dfc'
}

export async function updateSendGrid(
  first_name: string,
  last_name: string,
  email: string,
  member_id: string,
  member_level: MemberLevel,
  lists: SendGridList[] = [SendGridList.Subscribers]
): Promise<string> {
  client.setApiKey(process.env.SENDGRID_API_KEY);

  if (member_level >= MemberLevel.member) {
    lists.push(SendGridList.Members);
  }

  let [, data] = await client.request({
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: {
      list_ids: lists,
      contacts: [{ email, first_name, last_name, member_id, member_level }]
    }
  });

  return data;
}

export async function sendEmail(to: string, subject: string) {
  mail.setApiKey(process.env.SENDGRID_API_KEY);
  mail
    .send({
      to,
      from: 'system@guysnheat.com',
      subject,
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    })
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
}

export async function sendApplicationWorkflowEmail(
  to: string,
  title: string,
  message: string,
  button_text: string = 'Continue Application',
  button_url: string = ''
) {
  mail.setApiKey(process.env.SENDGRID_API_KEY);
  await mail.send({
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
  });
}
