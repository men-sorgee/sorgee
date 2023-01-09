export const config = {
  adminToken: process.env.ADMIN_TOKEN,
  google: {
    clientId:
      process.env.GOOGLE_CLIENT_ID ||
      '806946159244-d8tvf8n5rcb9hshl4agk2lfgli6vdmhe.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '1027516437134319648',
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || 'LigZOUxGK6JVIUXRURIKKukYu',
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
  },
  microsoft: {
    clientId: process.env.MICROSOFT_CLIENT_ID || 'bcb07c66-6c9b-422a-b6a1-29966b392849',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
  },
  yahoo: {
    clientId:
      process.env.YAHOO_CLIENT_ID ||
      'dj0yJmk9SlNWNlB3UDlqaGluJmQ9WVdrOWNsVmFlbmh6ZFcwbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTA1',
    clientSecret: process.env.YAHOO_CLIENT_SECRET,
  },
}
