import {
  AgreementData,
  Applicant,
  MemberLevel,
  Profile,
  UserType
} from "lib/models";
import {
  addUserToCongratsEmail,
  addUserToPledgeSurveyEmail,
  getUserEvents,
  updateUser
} from "lib/services/directus/server";
import { SendGridList, updateSendGrid } from "lib/services/sendgrid/server";
import { ApiResponse, withApplicant, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

async function Agree(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  try {
    withMethods(req, ['POST'])

    const applicant = await withApplicant(req, res)
    const { agree } = req.body as AgreementData
    const { application_status, user_type: current_level } = applicant
    if (application_status == 'approved' || MemberLevel[current_level] > MemberLevel.applicant)
      return res.status(200).end(ApiResponse(applicant))

    if (applicant && application_status == 'agreement' && agree) {

      const userEvents = await getUserEvents(applicant.id)
      const hasAttendedEvent = userEvents.some((e) => e.attended)
      const user_type: UserType = hasAttendedEvent ? 'brother' : (applicant.vouched_by ? 'inductee' : 'pledge')

      const updatedUser = (await updateUser<Applicant>(applicant.id, {
        application_status: 'approved',
        user_type,
        approved_date: new Date().toISOString(),
        rating: 5
      })) as Applicant

      await updateSendGrid(updatedUser as Profile,
        [
          SendGridList.Members
        ])

      await addUserToCongratsEmail(applicant.id, user_type)

      if (user_type == 'pledge')
        await addUserToPledgeSurveyEmail(applicant.id)

      return res.status(200).json(ApiResponse(updatedUser))
    }
  } catch (e: any) {
    console.error(e)
    res.status(500).json(ApiResponse(null, e?.message || e))
  }
}

export default Agree
