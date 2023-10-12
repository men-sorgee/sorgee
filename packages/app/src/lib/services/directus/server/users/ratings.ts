//@ts-ignore-file

import { Rating, RatingCollection } from "lib/models";
// Service Calls ------------------------------------
import { getAdminClient } from "lib/services/directus/server";

import { createItem, readItems, updateItem } from "@directus/sdk";

export async function getRating(user_id: string, collection: RatingCollection, item_id: string) {
  const admin = getAdminClient()
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

  const ratings = await admin.request(readItems('rating', {
    filter
  }))

  if (ratings && ratings.length > 0) {
    return ratings[0] as Rating
  } else {
    return null
  }
}

export async function getRatings(user_id: string) {
  const admin = getAdminClient()

  const ratings = await admin.request(readItems('rating', {

    filter: {
      user: {
        _eq: user_id,
      },
    },
  }))

  return ratings as Rating[]
}

export async function setRating(
  user_id: string,
  collection: RatingCollection,
  item: string,
  rate: number
) {
  const admin = getAdminClient()
  const existingRating = await getRating(user_id, collection, item)
  if (existingRating) {
    return (await admin.request(updateItem('rating', existingRating.id, { rate, item }))) as Rating
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
    return (await admin.request(createItem('rating', {
      user: user_id,
      collection,
      rate,
      ...value,
    }))) as Rating
  }
}

export async function setUserAverageRating(user_id: string) {
  const admin = getAdminClient()
  const ratings = await admin.request<Rating[]>(readItems('rating', {

    filter: {
      member: {
        _eq: user_id,
      },
    }
  }))

  const average = ratings.reduce((acc, rating) => acc + rating.rate, 0) / ratings.length

  if (average == 0) return

  const attendedEvents = await admin.request(readItems('events_users', {

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
  }))

  const missedEvents = await admin.request(readItems('events_users', {

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
  }))

  let penalPoints = 0
  const missedEventsCount = missedEvents.length
  const attendedEventsCount = attendedEvents.length
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

  if (rating && average !== rating)
    await admin.request(updateItem('users', user_id, { rating }))
  return rating
}
