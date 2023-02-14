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
import { normalize } from 'lib/utils'
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
    const level = MemberLevel[member.user_type]
    const { offset = 0, limit = 10, sort, ...props } = req.query as Record<keyof MemberSearch, any>
    const allowedLevels = getAllowedUsers(level)
    const params = normalize<SearchableMember>(props)
    const postQueryParams = {}

    const orSearchItems = []
    const andSearchItems = []
    andSearchItems.push({ show_profile: { _eq: true } })

    Object.keys(params).forEach((key) => {
      if (Array.isArray(member[key])) {
        postQueryParams[key].push(params[key])
      } else if (key == 'nickname') {
        let nickname = params[key].join('')
        orSearchItems.push({
          first_name: { _contains: nickname },
        })
        orSearchItems.push({
          nickname: { _contains: nickname },
        })
      } else {
        andSearchItems.push({ [key]: { _in: params[key] } })
      }
    })

    let userTypes = params.user_type as UserType[]
    let searchLevels = allowedLevels
    if (userTypes) {
      searchLevels = userTypes.filter((type: UserType) => allowedLevels.includes(type))
    }

    andSearchItems.push({ status: { _eq: 'active' } })
    andSearchItems.push({ application_status: { _eq: 'approved' } })

    andSearchItems.push({
      user_type: {
        _in: searchLevels,
      },
    })

    if (orSearchItems.length > 0) andSearchItems.push({ _or: orSearchItems })

    const searchParams = {
      _and: andSearchItems,
    }

    const results = await searchUsers<Partial<User>>(
      searchParams as any,
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
        'mannerisms',
        'last_login',
        'date_created',
      ],
      limit,
      offset,
      sort
    )

    if (Object.keys(postQueryParams).length > 0) {
      const filtered = results.data.filter((user) => {
        return Object.keys(postQueryParams).every((key) => {
          return postQueryParams[key].some((i: string) => user[key].includes(i))
        })
      })

      results.meta.filter_count = filtered.length
      results.data = filtered
    }

    return res.status(200).json(ApiResponse(results))
  } catch (e) {
    console.error(e.message || e, e.stack)
    res.status(400).json(ApiResponse(null, e.message || e))
  }
}
