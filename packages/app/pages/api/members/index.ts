import { NextApiRequest, NextApiResponse } from 'next'
import { searchUsers } from 'lib/services/directus/server/users'
import { withMember } from 'lib/utils/server'
import {
  ApiResponse,
  MemberLevel,
  SearchableMember,
  searchableMemberFields,
  User,
} from 'lib/models'
import { ManyItems } from '@directus/sdk'

type MemberSearch = SearchableMember & {
  offset?: number
  limit?: number
  sort: string
}

export default async function FindMembers(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ManyItems<Partial<User>>> | ApiResponse>
) {
  try {
    const member = await withMember(req, res)
    if (!member) {
      return res.status(401).json(ApiResponse(null, 'Unauthorized'))
    }

    const level = MemberLevel[member.user_type]
    const { offset = 0, limit = 20, sort, ...props } = req.query as Record<keyof MemberSearch, any>

    const searchParams = Object.keys(props)
      .filter((key: string) => searchableMemberFields.includes(key as any))
      .reduce(
        (acc, key) => {
          if (props[key].includes(',')) {
            acc[key] = {
              _in: props[key].split(','),
            }
          } else {
            acc[key] = {
              _in: [props[key]],
            }
          }
          return acc
        },
        {
          status: {
            _eq: 'active',
          },
          application_status: {
            _eq: 'approved',
          },
          show_profile: {
            _eq: true,
          },
          id: {
            _neq: member.id,
          },
        }
      )

    let allowedLevels = ['brother', 'big_brother', 'staff', 'admin']
    if (level >= MemberLevel.brother) allowedLevels = [...allowedLevels, 'inductee']
    if (level >= MemberLevel.big_brother) allowedLevels = [...allowedLevels, 'pledge']
    if (level >= MemberLevel.staff) allowedLevels = [...allowedLevels, 'applicant']

    const { user_type } = props
    let searchLevels = allowedLevels
    if (user_type) {
      if (props.user_type.includes(',')) {
        searchLevels = props.user_type.split(',').filter((type) => allowedLevels.includes(type))
      } else if (allowedLevels.includes(user_type)) {
        searchLevels = [user_type]
      }
    }

    searchParams['user_type'] = {
      _in: searchLevels,
    }

    //console.dir(searchParams)

    const results = await searchUsers<Partial<User>>(
      {
        ...searchParams,
      },
      [
        'id',
        'nick_name',
        'biography',
        'first_name',
        'picture',
        'user_type',
        'show_health',
        'show_interests',
        'presence',
        'location',
        'city',
        'state',
        'rating',
        'spectrum',
        'my_positions',
        'relationship_status',
        'last_login',
        'date_created',
      ],
      limit,
      offset,
      sort
    )

    return res.status(200).json(ApiResponse(results))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(400).json(ApiResponse(null, e.message || e))
  }
}
