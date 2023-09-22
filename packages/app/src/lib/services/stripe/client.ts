import { MemberFeature, MembershipType, PlanExtension } from "lib/models";

export const flirtFeatures: Array<MemberFeature> = ['view_directory', 'flirt'];
export const choiceFeatures: Array<MemberFeature> = [...flirtFeatures, 'view_attendees', 'buddy_list'];
export const plusFeatures: Array<MemberFeature> = [...choiceFeatures, 'chat', 'share_photos'];
export const proFeatures: Array<MemberFeature> = [...plusFeatures, 'private_events'];

export const subscriptionData: Record<string, PlanExtension> = {
  'prod_O1Vn4HTEQ7zIi4': {
    enabled: true,
    type: MembershipType[MembershipType.free],
    features: flirtFeatures,
  },
  'prod_O1PIu1Fr6aHIYV': {
    enabled: true,
    type: MembershipType[MembershipType.basic],
    features: choiceFeatures
  },
  'prod_O1PVvHrcOFN9kR': {
    enabled: true,
    type: MembershipType[MembershipType.plus],
    features: plusFeatures,
  },
  'prod_O1PLlZtT5hyf8s': {
    type: MembershipType[MembershipType.pro],
    features: proFeatures,
  },
}
