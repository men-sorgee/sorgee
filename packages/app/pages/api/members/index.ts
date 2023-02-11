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
    const searchParams = {
      show_profile: {
        _eq: true,
      },
      id: {
        _neq: member.id,
      },
    }

    Object.keys(params).forEach((key) => {
      if (Array.isArray(member[key])) {
        postQueryParams[key] = params[key]
      } else {
        searchParams[key] = { _in: params[key] }
      }
    })

    let userTypes = params.user_type as UserType[]
    let searchLevels = allowedLevels
    if (userTypes) {
      searchLevels = userTypes.filter((type: UserType) => allowedLevels.includes(type))
    }
    if (level < MemberLevel.staff) {
      searchParams['status'] = { _eq: 'active' }
      searchParams['application_status'] = { _eq: 'approved' }
    }
    searchParams['user_type'] = {
      _in: searchLevels,
    }

    const results = await searchUsers<Partial<User>>(
      searchParams,
      searchableMemberFields,
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
