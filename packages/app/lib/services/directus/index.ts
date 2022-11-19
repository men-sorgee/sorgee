import { User } from "./types.d";

export * from "./client";

export type FormOptions = Array<{
  text: string;
  value: string;
}>;
export * from "./service";

export const userFields = [
  "id",
  "first_name",
  "last_name",
  "email",
  "email_verified",
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
  "user_type",
  "privileged",
  "status",
  "vouched_by",
];

export type FormUser = {
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
  user_type: User["user_type"];
  privileged: User["privileged"];
  status: User["status"];
  invite?: string;
  picture?: string | null;
};

export type UserInvite = {
  e: User["email"];
  t: User["user_type"];
  v: User["id"];
};
