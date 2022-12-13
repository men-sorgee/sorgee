import { NextApiRequest, NextApiResponse } from 'next';
import { storeAuthEvent } from 'lib/services/directus/server';
import { withMethods } from '../../../lib/utils/server';
import { ApiResponse } from '../../../models';

type Auth0Event = {
  data: {
    date: string; //'2022-12-12T21:59:39.839Z';
    type: string; // 'fu';
    description: string; // 'Wrong email or verification code.';
    connection: string; // 'email';
    connection_id: string; // 'con_NvnF90TfJUKjjGCO';
    client_id: string; //'06E4boGvgSj32JrP0YJDpCix39TcIEES';
    client_name: string; // 'GuysNHeat';
    ip: '67.190.51.66';
    user_agent: string; //'Chrome 108.0.0 / Windows 10.0.0';
    details: any; // { error: {   message: 'Wrong email or verification code.'; }; };
    user_id: string; //'';
    user_name: string; // 'jason@thebrotherhoodgroup.org';
    strategy: string; //'email';
    strategy_type: string; //'passwordless';
    isMobile: false;
    log_id: string; // '90020221212215945080883175981911970115119169646721237010';
  };
};

export default async function HandleEvents(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  try {
    withMethods(req, ['POST']);

    const events: Auth0Event[] = req.body;
    await Promise.all(
      events.map((event) => {
        const {
          date,
          type,
          description,
          connection,
          connection_id,
          client_id,
          client_name,
          ip,
          user_agent,
          details = {},
          user_id,
          user_name,
          strategy,
          strategy_type,
          isMobile: mobile,
          log_id
        } = event.data;
        return storeAuthEvent({
          log_id,
          date,
          type,
          description,
          connection,
          connection_id,
          client_id,
          client_name,
          ip,
          user_agent,
          details,
          user_id,
          user_name,
          strategy,
          strategy_type,
          mobile,
          payload: event
        });
      })
    );

    res.status(200).end();
  } catch (e: any) {
    console.error(e);
    res.status(500).json(ApiResponse(null, e.message || e));
  }
}
