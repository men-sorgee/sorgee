import {
  getAllowedUsers,
  MemberLevel,
  SearchableMember,
  searchableMemberFields,
  User,
  UserType
} from "lib/models";
import { searchUsers } from "lib/services/directus/server/users";
import { normalize } from "lib/utils";
import { ApiResponse, ApiResponseType, withMember } from "lib/utils/server";
import { NextApiRequest, NextApiResponse } from "next";

export type MemberSearch = SearchableMember & {
  offset?: number
  limit?: number
  sort: string
  photos?: boolean
  online?: boolean
}

export default async function FindMembers(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType<Partial<User>> | ApiResponseType>
) {
  try {
    const member = await withMember(req, res)
    const level = MemberLevel[member.user_type]
    const { page: p = 1, limit: l = 20, sort = '-last_login', online, photos, ...props } = req.query
    const page = Number(p)
    const limit = Number(l)

    const allowedLevels = getAllowedUsers(level)
    const params = normalize<{
      nickname?: string[]
      keywords?: string[],
      user_type?: UserType[]
    }>(props)


    const orSearchItems = []
    const andSearchItems = []

    andSearchItems.push({
      show_profile: {
        _eq: true,
      },
      status: {
        _eq: 'active',
      }
    })

    let blockList = member.blocked_by.map((u) => u.user_id)
    if (blockList.length > 0 && level < MemberLevel.staff) {
      andSearchItems.push({
        id: {
          _nin: blockList,
        }
      })
    }


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
      switch (key) {
        case 'nickname':
          let nickname = params[key].join('')
          andSearchItems.push({
            _or: [
              { nickname: { _icontains: nickname } },
              { first_name: { _icontains: nickname } },
            ]
          })
          break
        case 'keywords':
          let keywords = params[key].join(' ')
          andSearchItems.push({
            _or: [
              { nickname: { _icontains: keywords } },
              { first_name: { _icontains: keywords } },
              { biography: { _icontains: keywords } }
            ],
          })

          break
        case 'user_type':
          andSearchItems.push({
            user_type: { _in: params[key] },
          })
          break
      }

    })


    let userTypes = params.user_type as UserType[]
    let searchLevels = allowedLevels
    if (userTypes) {
      searchLevels = userTypes.filter((type: UserType) => allowedLevels.includes(type))
    }

    andSearchItems.push({ status: { _eq: 'active' } })
    andSearchItems.push({ application_status: { _eq: 'approved' } })

    if (searchLevels.length > 0) {
      andSearchItems.push({
        user_type: {
          _in: searchLevels,
        },
      })
    }

    if (orSearchItems.length > 0) andSearchItems.push({ _or: orSearchItems })

    const searchParams = {
      _and: andSearchItems,
    }

    // console.dir({
    //   searchParams,
    // }, { depth: 10 })

    let results = null
    try {
      results = await searchUsers<SearchableMember>(
        { filter: searchParams as any, fields: searchableMemberFields, limit, page, sort })
    } catch (e) {
      console.error('Errored with params:', JSON.stringify(searchParams, null, 2))
      console.dir(searchParams, { depth: 10 })
      throw e
    }

    return res.status(200).json(ApiResponse(results))
  } catch (e) {
    console.error(e)
    res.status(400).json(ApiResponse(null, e.message || e))
  }
}
