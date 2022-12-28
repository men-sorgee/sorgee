import { NextApiRequest, NextApiResponse } from 'next';
import { withMethods } from 'lib/utils/server';
import { ApiResponse } from '@/lib/models';

export default function LogError(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!withMethods(req, ['POST'])) return;

    const { error, errorInfo } = req.body;

    console.error(error, errorInfo);

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}
