import { MembershipType } from "lib/models";

const subscriptionData = {
  prod_O1Vn4HTEQ7zIi4: {
    type: MembershipType[MembershipType.free],
    features: ['view_directory', 'flirt'],
  },
  prod_O1PIu1Fr6aHIYV: {
    type: MembershipType[MembershipType.basic],
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list'],
    label: 'Popular',
  },
  prod_O1PVvHrcOFN9kR: {
    type: MembershipType[MembershipType.plus],
    features: ['view_directory', 'flirt', 'view_attendees', 'buddy_list', 'chat', 'share_photos'],
  },
  prod_O1PLlZtT5hyf8s: {
    type: MembershipType[MembershipType.pro],
    features: [
      'view_directory',
      'flirt',
      'view_attendees',
      'buddy_list',
      'chat',
      'share_photos',
      'private_events',
    ],
  },
}

export { subscriptionData }
