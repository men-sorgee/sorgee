import { Applicant, MemberLevel, SignUpForm, User } from "lib/models";
import {
  createUser,
  findUser,
  updateUser
} from "lib/services/directus/server/users";
import { ApiResponse, ApiResponseType, withMethods } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

import { findPromo } from "../../../lib/services/directus/server/site";

export default async function Register(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<Applicant> | ApiResponseType>
) {
  try {
    withMethods(req, ['POST'])

    const {
      first_name,
      last_name,
      birth_month,
      birth_year,
      email: e,
      promo: promoCode,
    } = req.body as SignUpForm

    const email = e.toLocaleLowerCase()

    if ([first_name, birth_month, birth_year, email].some((v) => v == undefined)) {
      return res.status(400).json(ApiResponse(null, 'Missing required fields'))
    }

    const promo = promoCode ? await findPromo(promoCode) : null

    const existingUser = await findUser<User>(email)
    if (existingUser) {
      const { notes, status, user_type, application_status } = existingUser

      if (status == 'banned') {
        return res.status(400).json(ApiResponse(null, 'User is banned'))
      }

      if (MemberLevel[user_type] > MemberLevel.applicant && status == 'active' && application_status == 'approved') {
        return res.status(200).json(ApiResponse(existingUser, 'User exists'))
      }

      const updatedUser = await updateUser(existingUser.id, {
        first_name,
        last_name,
        birth_month,
        birth_year,
        vouched_by: (promo ? promo.vouching_user : null),
        notes: (notes ? `${notes}: ` : '') + 'registered via app' + (promoCode ? ` with promo ${promoCode}` : ''),
        promo: (promo ? promo.id : null),
        status: 'active',
        user_type: status == 'inactive' ? user_type : 'applicant',
      })
      return res.status(200).json(ApiResponse(updatedUser))
    } else {
      const newUser = await createUser({
        first_name,
        last_name,
        birth_month,
        birth_year,
        email,
        notes: 'registered via app',
        status: 'active',
        user_type: 'applicant',
        vouched_by: promo ? promo.vouching_user as string : null,
        promo: promo ? promo.id : null,
      })
      return res.status(200).json(ApiResponse(newUser))
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
