import { User } from "./types.d";

export * from "./client";
export * from "./types.d";
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
  "vouched_by",
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
];

export type UserInvite = {
  e: User["email"];
  t: User["user_type"];
  v: User["id"];
};
