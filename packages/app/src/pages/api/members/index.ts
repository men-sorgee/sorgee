import {
  ApiResponse,
  getAllowedUsers,
  MemberLevel,
  SearchableMember,
  searchableMemberFields,
  User,
  UserType,
} from 'lib/models'
import { searchUsers } from 'lib/services/directus/server/users'
import { normalize } from 'lib/utils'
import { withMember } from 'lib/utils/server'
import { NextApiRequest, NextApiResponse } from 'next'

import { ManyItems } from '@directus/sdk'

export type MemberSearch = SearchableMember & {
  offset?: number
  limit?: number
  sort: string
  photos?: boolean
  online?: boolean
}

export default async function FindMembers(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ManyItems<Partial<User>>> | ApiResponse>
) {
  try {
    const member = await withMember(req, res)
    const level = MemberLevel[member.user_type]
    const { page: p = 1, limit: l = 20, sort = '-last_login', online, photos, ...props } = req.query
    const page = Number(p)
    const limit = Number(l)

    const allowedLevels = getAllowedUsers(level)
    const params = normalize<SearchableMember>(props)
    const postQueryParams = {}

    const orSearchItems = []
    const andSearchItems = []

    let blockList = [member.id, ...member.blocked?.map((u) => u.blocked_id) || []]

    andSearchItems.push({
      show_profile: {
        _eq: true,
      },
      id: {
        _nin: blockList,
      },
    })

    if (sort.includes('last_login')) {
      andSearchItems.push({ last_login: { _nnull: true } })
    }

    if (photos) {
      andSearchItems.push({
        my_photos: {
          is_public: { _eq: true },
        },
      })
    }

    if (online) {
      andSearchItems.push({
        presence: {
          _eq: 'online',
        },
      })
    }

    Object.keys(params).forEach((key) => {
      if (Array.isArray(member[key])) {
        let filter = params[key]
        postQueryParams[key] = Array.isArray(filter) ? filter : [filter]
      } else if (key == 'nickname') {
        let nickname = params[key].join('')
        andSearchItems.push({
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
      searchableMemberFields,
      limit,
      page,
      sort
    )

    if (Object.keys(postQueryParams).length > 0) {
      const filtered = results.data.filter((user) => {
        return Object.keys(postQueryParams).every((key) => {
          return postQueryParams[key].some((i: string) => user[key] && user[key].includes(i))
        })
      })

      results.meta.filter_count = filtered.length
      results.data = filtered
    }

    return res.status(200).json(ApiResponse(results))
  } catch (e) {
    console.error(e)
    res.status(400).json(ApiResponse(null, e.message || e))
  }
}
