import client from '@sendgrid/client';
client.setApiKey(process.env.SENDGRID_API_KEY);

export const lists = {
  subscribers: 'fdfecde5-2787-499a-a879-955959fc9720'
}

export async function addSubscriber(
  first_name: string, email: string): Promise<string> {

  let [response, data] = await client.request({
    url: `/v3/marketing/contacts`,
    method: 'PUT',
    body: {
      list_ids: [lists.subscribers],
      contacts: [{ email, first_name }]
    }
  });

  return data
}