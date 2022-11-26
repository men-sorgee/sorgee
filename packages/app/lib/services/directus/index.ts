import { User } from './types'



export const memberFields = [
  "id",
  "first_name",
  "last_name",
  "email",
  "email_verified",
  "photo",
  "phone",
  "biography",
  "needs_guidance",
  "spectrum",
  "relationship_status",
  "event_availability",
  "age",
  "height",
  "weight",
  "skin_tone",
  "my_positions",
  "sexual_scenes",
  "application_status",
  "user_type", // level
  "privileged",
  "vouched_by",
  "last_login",
  "status",
  "in_sendgrid"
];

export type Member = {
  photo: string
  id: User["id"];
  first_name: User["first_name"];
  last_name: User["last_name"];
  email: User["email"];
  vouched_by: User["vouched_by"];
  email_verified: User["email_verified"];
  phone: User["phone"];
  biography: User["biography"];
  needs_guidance: User["needs_guidance"];
  spectrum: User["spectrum"];
  relationship_status: User["relationship_status"];
  event_availability: User["event_availability"];
  age: User["age"];
  height: User["height"];
  weight: User["weight"];
  skin_tone: User["skin_tone"];
  my_positions: User["my_positions"];
  sexual_scenes: User["sexual_scenes"];
  user_type: "reject" | "subscriber" | "user" | "pledge" | "member" | "brother" | "big_brother"| "staff";
  privileged: User["privileged"];
  invite?: string;
  picture?: string | null;
  status: "new" | "active" | "inactive" | "stale" | "deleted" | "banned";
  application_status: "apply"| "verify" | "review" | "agreement" | "approved" | "denied";
  last_login: User["last_login"];
  in_sendgrid: User["in_sendgrid"];
};

export type UserInvite = {
  e: User["email"];
  t: User["user_type"];
  v: User["id"];
};
