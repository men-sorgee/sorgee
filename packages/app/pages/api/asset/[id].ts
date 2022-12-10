import { NextApiRequest, NextApiResponse } from 'next';
import { adminToken } from 'config/server';
import { adminBaseUrl } from 'config/client';

export async function getAsset(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query.id;
  //const { referer } = req.headers;
  //if (!referer || !referer.startsWith(adminBaseUrl))
  //  return res.status(404).end();

  // TODO: add content policy protection
  const url = `${adminBaseUrl}/assets/${id}?fit=cover&access_token=${adminToken}`;

  const response = await fetch(url);
  res.setHeader('cache', 'public, max-age=31536000, immutable');
  res.status(response.status).send(response.body);
}
