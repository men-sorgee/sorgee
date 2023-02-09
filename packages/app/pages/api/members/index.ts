import { NextApiRequest, NextApiResponse } from 'next'
import { searchUsers } from 'lib/services/directus/server/users'
import { withMember } from 'lib/utils/server'
import {
  ApiResponse,
  getAllowedUsers,
  MemberLevel,
  SearchableMember,
  searchableMemberFields,
  User,
  UserType,
} from 'lib/models'
import { ManyItems } from '@directus/sdk'

type MemberSearch = SearchableMember & {
  offset?: number
  limit?: number
  sort: string
  photos: boolean
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

    const allowedLevels = getAllowedUsers(level)

    const searchParams = Object.keys(props)
      .filter((key: string) => searchableMemberFields.includes(key as any))
      .reduce(
        (acc, key) => {
          if (Array.isArray(props[key])) {
            acc[key] = {
              _in: props[key],
            }
          } else {
            acc[key] = {
              _in: [props[key]],
            }
          }
          return acc
        },
        {
          show_profile: {
            _eq: true,
          },
          id: {
            _neq: member.id,
          },
        }
      )

    const { user_type } = props
    let searchLevels = allowedLevels
    if (user_type) {
      if (Array.isArray(user_type)) {
        searchLevels = user_type.filter((type: UserType) => allowedLevels.includes(type))
      } else if (allowedLevels.includes(user_type)) {
        searchLevels = [user_type]
      }
    }
    if (level < MemberLevel.staff) {
      searchParams['status'] = { _eq: 'active' }
      searchParams['application_status'] = { _eq: 'approved' }
    }

    searchParams['user_type'] = {
      _in: searchLevels,
    }

    //console.dir(searchParams)

    const results = await searchUsers<Partial<User>>(
      searchParams,
      [
        'id',
        'status',
        'nickname',
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
