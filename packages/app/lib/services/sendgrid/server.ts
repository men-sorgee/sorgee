import client from '@sendgrid/client'
import mail, { MailDataRequired } from '@sendgrid/mail'
import { MemberLevel, Profile } from 'lib/models'

function getClient() {
  client.setApiKey(process.env.SENDGRID_API_KEY)
  return client
}

function getMailer() {
  mail.setApiKey(process.env.SENDGRID_API_KEY)
  return mail
}

export enum SendGridCategory {
  Notification = 'notification',
  Invitation = 'invitation',
  Confirmation = 'confirmation',
  Survey = 'survey',
}

export enum SendGridList {
  Subscribers = 'fdfecde5-2787-499a-a879-955959fc9720',
  Members = '44971668-1ee8-4f9e-834a-abd5c65a4dfc',
}

export enum SendGridTemplate {
  AppNotification = 'd-7fe0a94b7c0b40b2a68b5d998ee6f7af',
  EventInvitation = 'd-2ddc88724bf2494dab869838dc87cb50',
  EventConfirmation = 'd-a06f70ac86cd4d69b6c43cb2621d1e9f',
  Survey = 'd-80ca3146dcc74b6ca1a7d4be4f4a36ba',
}

export async function updateSendGrid(
  user: Profile,
  lists: SendGridList[] = [SendGridList.Subscribers]
): Promise<string> {
  if (!user) return
  const { first_name, last_name, email, id: member_id, user_type } = user || {}
  const member_level = MemberLevel[user_type || 'subscriber'] as number
  if (member_level >= MemberLevel.inductee) {
    lists.push(SendGridList.Members)
  }
  try {
    let [response, data] = await getClient().request({
      url: `/v3/marketing/contacts`,
      method: 'PUT',
      body: {
        contacts: [
          {
            email,
            first_name,
            last_name,
            member_id,
            member_level,
          },
        ],
        list_ids: lists,
      },
    })
    if (response.statusCode > 202) {
      throw new Error('Sendgrid Error:' + JSON.stringify(data))
    }
    console.log('Contact synced: ' + email)
    return data
  } catch (error) {
    console.error(error.message, error)
  }
}

async function convertMarkdownToHtml(markdown: string) {
  const { remark } = await import('remark')
  const { default: html } = await import('remark-html')
  return remark().use(html).processSync(markdown).toString()
}

// to verify we never send the same email twice
// hash email + subject + body and check this store
// if it exists, don't send the email
const hashSet = new Set<string>()

export async function sendNotificationEmail(
  to_email: string,
  to_name: string,
  subject: string,
  body: string,
  data: Record<string, any>,
  templateId: SendGridTemplate = SendGridTemplate.AppNotification,
  category: SendGridCategory = SendGridCategory.Notification
) {
  body = await convertMarkdownToHtml(body)

  const hash = Buffer.from(`${to_email}${subject}${body}`, 'base64').toString()
  if (hashSet.has(hash)) {
    console.log(`SendGrid Email ${category} Skipped: ${to_email}`)
    return
  }

  const email: MailDataRequired = {
    personalizations: [
      {
        to: [{ email: to_email, name: to_name }],
        dynamicTemplateData: {
          email: to_email,
          subject,
          name: to_name,
          body,
          message: body,
          ...data,
        },
      },
    ],
    from: 'GuysNHeat <system@guysnheat.com>',
    subject,
    templateId,
    category,
  }
  try {
    const [response, data] = await getMailer().send(email, false)
    if (response.statusCode > 202) {
      const { errors } = response.body as { errors: string[] }
      throw new Error(
        `Sendgrid Email ${category} Error: ${errors?.join(', ') || data || response.body}`
      )
    }
    console.log(`SendGrid Email ${category} Sent: ${to_email}`)
    hashSet.add(hash)
    return data
  } catch (error) {
    console.error(error.message, error)
  }
}
