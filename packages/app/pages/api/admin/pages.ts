import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { Applicant, MenuPage } from 'lib/services/directus';

import { ApiResponse } from 'lib/types';
import { listActivePages } from 'lib/services/directus/static';

export default async function getPages(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
) {
  try {
    const pages = await listActivePages();
    const response = pages
      .filter((p) => p.url !== 'index')
      .map((p) => {
        return {
          title: p.title,
          path: `/about/${p.url}`
        };
      });

    res.status(200).json(new ApiResponse<Array<MenuPage>>(null, response));
  } catch (e) {
    console.error(e);
    res.status(500).json(new ApiResponse(e.message || e));
  }
}
