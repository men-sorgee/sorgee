//@ts-ignore-file

import {

  Rating,
  RatingCollection,
} from 'lib/models'


// Service Calls ------------------------------------
import { getAdminClient } from '../'

export async function getRating(user_id: string, collection: RatingCollection, item_id: string) {
  const adminClient = await getAdminClient()
  const filter = {
    user: {
      _eq: user_id,
    },
    collection: {
      _eq: collection,
    },
  }
  switch (collection) {
    case 'events': {
      filter['event'] = {
        _eq: item_id,
      }
      break
    }
    case 'users': {
      filter['member'] = {
        _eq: item_id,
      }
      break
    }
  }

  const { data: ratings } = await adminClient.items('rating').readByQuery({
    filter,
  })

  if (ratings && ratings.length > 0) {
    return ratings[0] as Rating
  } else {
    return null
  }
}

export async function getRatings(user_id: string) {
  const adminClient = await getAdminClient()

  const { data: ratings } = await adminClient.items('rating').readByQuery({
    filter: {
      user: {
        _eq: user_id,
      },
    },
  })

  return ratings as Rating[]
}

export async function setRating(
  user_id: string,
  collection: RatingCollection,
  item: string,
  rate: number
) {
  const adminClient = await getAdminClient()
  const existingRating = await getRating(user_id, collection, item)
  if (existingRating) {
    return (await adminClient.items('rating').updateOne(existingRating.id, {
      rate,
    })) as Rating
  } else {
    let value = {} as Partial<Rating>
    switch (collection) {
      case 'events': {
        value.event = item
        break
      }
      case 'users': {
        value.member = item
        break
      }
    }
    return (await adminClient.items('rating').createOne({
      user: user_id,
      collection,
      rate,
      ...value,
    })) as Rating
  }
}

export async function setUserAverageRating(user_id: string) {
  const adminClient = await getAdminClient()
  const { data: ratings } = await adminClient.items('rating').readByQuery({
    filter: {
      member: {
        _eq: user_id,
      },
    }
  })

  const average = ratings.reduce((acc, rating) => acc + rating.rate, 0) / ratings.length

  const attendedEvents = await adminClient.items('events_users').readByQuery({
    filter: {
      users_id: {
        id: {
          _eq: user_id,
        }
      },
      attended: {
        _eq: true,
      }
    }
  })

  const missedEvents = await adminClient.items('events_users').readByQuery({
    filter: {
      users_id: {
        id: {
          _eq: user_id,
        }
      },
      attended: {
        _eq: false,
      }
    }
  })

  let penalPoints = 0
  const missedEventsCount = missedEvents.data.length
  const attendedEventsCount = attendedEvents.data.length
  if (missedEventsCount > 0) {
    // penalize 1 point for every missed events

    penalPoints = missedEventsCount
    if (attendedEventsCount > 0) {
      // you get one point back for every 3 events attended
      penalPoints = penalPoints - Math.floor(attendedEventsCount / 3)
    }
  }

  let rating = Math.floor(average - penalPoints)

  if (rating < 1) rating = 1
  if (rating > 5) rating = 5

  await adminClient.items('users').updateOne(user_id, {
    rating,
  })
  return rating
}
