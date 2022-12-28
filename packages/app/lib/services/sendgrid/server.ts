import client from '@sendgrid/client'
import mail, { MailDataRequired } from '@sendgrid/mail'
import { MemberLevel, Profile } from '@/lib/models'
import { convertMarkdownToHtml } from '../remark'

function getClient() {
  client.setApiKey(process.env.SENDGRID_API_KEY)
  return client
}

function getMailer() {
  mail.setApiKey(process.env.SENDGRID_API_KEY)
  return mail
}

export enum SendGridList {
  Subscribers = 'fdfecde5-2787-499a-a879-955959fc9720',
  Members = '44971668-1ee8-4f9e-834a-abd5c65a4dfc',
}

export enum SendGridTemplate {
  AppNotification = 'd-7fe0a94b7c0b40b2a68b5d998ee6f7af',
}

export async function updateSendGrid(
  user: Profile,
  lists: SendGridList[] = [SendGridList.Subscribers]
): Promise<string> {
  const { first_name, last_name, email, id: member_id, user_type } = user
  const member_level = MemberLevel[user_type]
  if (member_level >= MemberLevel.member) {
    lists.push(SendGridList.Members)
  }
  let [, data] = await getClient().request({
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: {
      list_ids: lists,
      contacts: [{ email, first_name, last_name, member_id, member_level }],
    },
  })
  return data
}

export async function sendEmail(to: string, subject: string) {
  await getMailer().send({
    to,
    from: 'system@guysnheat.com',
    subject,
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  })
  console.log('Email sent')
}

export async function sendNotificationEmail(
  to: string,
  subject: string,
  message: string,
  button_text: string,
  button_url: string,
  category: string = 'notification',
  templateId: string = SendGridTemplate.AppNotification
) {
  if (message.includes('\n')) message = convertMarkdownToHtml(message)

  const email: MailDataRequired = {
    personalizations: [
      {
        to: [{ email: to }],
        dynamicTemplateData: {
          subject,
          message,
          button_text,
          button_url,
        },
      },
    ],
    from: 'GuysNHeat <system@guysnheat.com>',
    subject,
    templateId,
    category,
  }
  try {
    await getMailer().send(email)
    console.log('Email sent')
  } catch (error) {
    console.dir({
      button_text,
      button_url,
    })
    console.error(error)
    if (error.response) {
      console.error(error.response.body)
    }
  }
}
