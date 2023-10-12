import {
  MemberFeature,
  MembershipNames,
  MembershipType,
  PlanExtension
} from "lib/models";

export const flirtFeatures: Array<MemberFeature> = ['view_directory', 'flirt'];
export const choiceFeatures: Array<MemberFeature> = [...flirtFeatures, 'view_attendees', 'buddy_list'];
export const plusFeatures: Array<MemberFeature> = [...choiceFeatures, 'chat', 'share_photos'];
export const proFeatures: Array<MemberFeature> = [...plusFeatures, 'private_events'];

export const subscriptionData: Record<string, PlanExtension> = {
  'prod_O1Vn4HTEQ7zIi4': {
    enabled: true,
    type: MembershipType[MembershipType.free] as MembershipNames,
    features: flirtFeatures,
  },
  'prod_O1PIu1Fr6aHIYV': {
    enabled: true,
    type: MembershipType[MembershipType.basic] as MembershipNames,
    features: choiceFeatures
  },
  'prod_O1PVvHrcOFN9kR': {
    enabled: true,
    type: MembershipType[MembershipType.plus] as MembershipNames,
    features: plusFeatures,
  },
  'prod_O1PLlZtT5hyf8s': {
    type: MembershipType[MembershipType.pro] as MembershipNames,
    features: proFeatures,
  },
}
