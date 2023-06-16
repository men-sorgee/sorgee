import { ApiResponse, Applicant, SignUpForm, User } from 'lib/models'
import { findPromo } from 'lib/services/directus/server'
import { createUser, findUser, updateUser } from 'lib/services/directus/server/users'
import { withMethods } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function Register(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Applicant> | ApiResponse>
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

    const email = e?.toLocaleLowerCase()

    if ([first_name, last_name, birth_month, birth_year, email].some((v) => v == undefined)) {
      return res.status(400).json(ApiResponse(null, 'Missing required fields'))
    }

    const promo = promoCode ? await findPromo(promoCode) : null

    const existingUser = await findUser<User>(email)
    if (existingUser) {
      const updatedUser = await updateUser(existingUser.id, {
        first_name,
        last_name,
        birth_month,
        birth_year,
        vouched_by: promo ? promo.vouching_user : null,
        notes: existingUser.notes + ': registered via app',
        promo: promo ? promo.id : null,
        status: 'active',
        user_type: 'applicant',
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
        vouched_by: promo ? promo.vouching_user : null,
        promo: promo ? promo.id : null,
      })
      return res.status(200).json(ApiResponse(newUser))
    }
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(405).json(ApiResponse(null, e.message || e))
  }
}
