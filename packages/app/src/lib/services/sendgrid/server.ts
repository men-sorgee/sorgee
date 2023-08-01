import { MemberLevel, Profile } from 'lib/models'
import client from '@sendgrid/client'
import mail, { MailDataRequired } from '@sendgrid/mail'

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
  Notification = 'd-7fe0a94b7c0b40b2a68b5d998ee6f7af',
  Invitation = 'd-2ddc88724bf2494dab869838dc87cb50',
  Confirmation = 'd-a06f70ac86cd4d69b6c43cb2621d1e9f',
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
      console.dir(response.body, { depth: null })
      throw new Error('Sendgrid Error:' + JSON.stringify(data, null, 2))
    }
    console.log('SendGrid: contact synced: ' + email)
    return data
  } catch (error) {
    console.error(error)
  }
}

async function convertMarkdownToHtml(markdown: string) {
  const { remark } = await import('remark')
  const { default: html } = await import('remark-html')
  return remark().use(html).processSync(markdown).toString()
}




export async function sendNotificationEmail(
  to_email: string,
  to_name: string,
  subject: string,
  body: string,
  data: Record<string, any>,
  templateId: SendGridTemplate = SendGridTemplate.Notification,
  category: SendGridCategory = SendGridCategory.Notification,
  notification_id: string = null,
  html: string = null
) {
  body = await (await convertMarkdownToHtml(body)).replace('null', '') + html

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
    customArgs: {
      notification_id,
    },
  }
  try {
    const [response, results] = await getMailer().send(email, false)
    if (response.statusCode > 202) {
      console.dir(results, {
        depth: null,
      })
      throw new Error('Sendgrid Error:' + JSON.stringify(results, null, 2))
    }
    console.log(`SendGrid: ${category} email sent to ${to_email}`)
    return data
  } catch (error) {
    console.error(error)
  }
}
