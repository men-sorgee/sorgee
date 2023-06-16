import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { DirectusFile } from './DirectusFiles'
import { DirectusUsers } from './DirectusUsers'
import { EventsUser } from './EventsUsers'
import { Location } from './Location'
import { Messages } from './Messages'
import { NotificationsUsers } from './NotificationsUsers'
import { Promos } from './Promos'
import { Rating } from './Rating'
import { SurveyAnswers } from './SurveyAnswers'
import { UserAccount } from './UserAccount'
import { UserBuddy } from './UserBuddy'
import { UserContactAttempt } from './UserContactAttempt'
import { UserEmailEvents } from './UserEmailEvents'
import { UserRelationships } from './UserRelationships'
import { UserSession } from './UserSession'
import { UsersFiles } from './UsersFiles'
import { UsersPhotos } from './UsersPhotos'

@Index('users_email_unique', ['email'], { unique: true })
@Index('users_pkey', ['id'], { unique: true })
@Entity('users', { schema: 'public' })
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string

  @Column('character varying', {
    name: 'status',
    length: 255,
    default: () => "'new'",
  })
  status: string

  @Column('timestamp with time zone', {
    name: 'date_created',
    nullable: true,
    default: () => 'now()',
  })
  dateCreated: Date | null

  @Column('timestamp with time zone', {
    name: 'date_updated',
    nullable: true,
    default: () => 'now()',
  })
  dateUpdated: Date | null

  @Column('character varying', {
    name: 'first_name',
    length: 255,
    default: () => "'Prospective Brother'",
  })
  firstName: string

  @Column('character varying', {
    name: 'last_name',
    nullable: true,
    length: 255,
  })
  lastName: string | null

  @Column('character varying', {
    name: 'user_type',
    nullable: true,
    length: 255,
    default: () => "'applicant'",
  })
  userType: string | null

  @Column('character varying', {
    name: 'phone',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  phone: string | null

  @Column('boolean', {
    name: 'phone_verified',
    nullable: true,
    default: () => 'false',
  })
  phoneVerified: boolean | null

  @Column('character varying', { name: 'email', unique: true, length: 255 })
  email: string

  @Column('boolean', {
    name: 'email_verified',
    nullable: true,
    default: () => 'false',
  })
  emailVerified: boolean | null

  @Column('integer', { name: 'weight', nullable: true })
  weight: number | null

  @Column('numeric', {
    name: 'cock_length',
    nullable: true,
    precision: 10,
    scale: 1,
    default: () => 'NULL::numeric',
  })
  cockLength: string | null

  @Column('character varying', { name: 'build', nullable: true, length: 255 })
  build: string | null

  @Column('character varying', {
    name: 'cock_girth',
    nullable: true,
    length: 255,
  })
  cockGirth: string | null

  @Column('json', { name: 'cock_attributes', nullable: true, default: [] })
  cockAttributes: object | null

  @Column('character varying', {
    name: 'spectrum',
    nullable: true,
    length: 255,
    default: () => "'bisexual'",
  })
  spectrum: string | null

  @Column('character varying', {
    name: 'relationship_status',
    nullable: true,
    length: 255,
  })
  relationshipStatus: string | null

  @Column('character varying', {
    name: 'skin_tone',
    nullable: true,
    length: 255,
  })
  skinTone: string | null

  @Column('text', { name: 'notes', nullable: true })
  notes: string | null

  @Column('json', { name: 'flags', nullable: true })
  flags: object | null

  @Column('integer', { name: 'age', nullable: true })
  age: number | null

  @Column('character varying', {
    name: 'mannerisms',
    nullable: true,
    length: 255,
  })
  mannerisms: string | null

  @Column('character varying', { name: 'height', nullable: true, length: 255 })
  height: string | null

  @Column('character varying', {
    name: 'nickname',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  nickname: string | null

  @Column('timestamp with time zone', {
    name: 'last_login',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLogin: Date | null

  @Column('boolean', {
    name: 'needs_guidance',
    nullable: true,
    default: () => 'false',
  })
  needsGuidance: boolean | null

  @Column('text', { name: 'biography', nullable: true })
  biography: string | null

  @Column('json', { name: 'event_availability', nullable: true })
  eventAvailability: object | null

  @Column('json', { name: 'sexual_scenes', nullable: true, default: [] })
  sexualScenes: object | null

  @Column('json', { name: 'my_positions', nullable: true, default: [] })
  myPositions: object | null

  @Column('json', { name: 'their_positions', nullable: true, default: [] })
  theirPositions: object | null

  @Column('json', { name: 'my_roles', nullable: true, default: [] })
  myRoles: object | null

  @Column('json', { name: 'their_roles', nullable: true, default: [] })
  theirRoles: object | null

  @Column('character varying', {
    name: 'body_hair',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  bodyHair: string | null

  @Column('character varying', {
    name: 'facial_hair',
    nullable: true,
    length: 255,
  })
  facialHair: string | null

  @Column('json', {
    name: 'social_scenes',
    nullable: true,
    default: ['group_sex'],
  })
  socialScenes: object | null

  @Column('character varying', {
    name: 'hair_color',
    nullable: true,
    length: 255,
  })
  hairColor: string | null

  @Column('character varying', {
    name: 'hair_style',
    nullable: true,
    length: 255,
  })
  hairStyle: string | null

  @Column('json', { name: 'body_attributes', nullable: true, default: [] })
  bodyAttributes: object | null

  @Column('json', { name: 'their_spectrum', nullable: true, default: [] })
  theirSpectrum: object | null

  @Column('character varying', {
    name: 'eye_color',
    nullable: true,
    length: 255,
  })
  eyeColor: string | null

  @Column('character varying', {
    name: 'ball_size',
    nullable: true,
    length: 255,
  })
  ballSize: string | null

  @Column('character varying', {
    name: 'ball_gravity',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  ballGravity: string | null

  @Column('character varying', {
    name: 'city',
    nullable: true,
    length: 255,
    default: () => "'Denver'",
  })
  city: string | null

  @Column('json', { name: 'cum_attributes', nullable: true, default: [] })
  cumAttributes: object | null

  @Column('json', { name: 'load_policy', nullable: true, default: [] })
  loadPolicy: object | null

  @Column('character varying', {
    name: 'hiv_status',
    nullable: true,
    length: 255,
  })
  hivStatus: string | null

  @Column('date', { name: 'last_tested', nullable: true })
  lastTested: string | null

  @Column('json', { name: 'vaccinations', nullable: true })
  vaccinations: object | null

  @Column('character varying', {
    name: 'application_status',
    length: 255,
    default: () => "'apply'",
  })
  applicationStatus: string

  @Column('boolean', {
    name: 'in_sendgrid',
    nullable: true,
    default: () => 'false',
  })
  inSendgrid: boolean | null

  @Column('boolean', {
    name: 'video_consent',
    nullable: true,
    default: () => 'false',
  })
  videoConsent: boolean | null

  @Column('boolean', { name: 'photo_consent', nullable: true })
  photoConsent: boolean | null

  @Column('character varying', {
    name: 'photo_denial_reason',
    nullable: true,
    length: 255,
  })
  photoDenialReason: string | null

  @Column('character varying', { name: 'tags', nullable: true, length: 255 })
  tags: string | null

  @Column('geometry', { name: 'location', nullable: true })
  location: string | null

  @Column('boolean', { name: 'can_host', nullable: true })
  canHost: boolean | null

  @Column('character varying', {
    name: 'contact_preference',
    length: 255,
    default: () => "'email'",
  })
  contactPreference: string

  @Column('boolean', { name: 'event_invites', default: () => 'true' })
  eventInvites: boolean

  @Column('boolean', {
    name: 'show_profile',
    nullable: true,
    default: () => 'true',
  })
  showProfile: boolean | null

  @Column('boolean', {
    name: 'show_interests',
    nullable: true,
    default: () => 'true',
  })
  showInterests: boolean | null

  @Column('json', { name: 'can_host_events', nullable: true })
  canHostEvents: object | null

  @Column('boolean', {
    name: 'show_health',
    nullable: true,
    default: () => 'true',
  })
  showHealth: boolean | null

  @Column('character varying', {
    name: 'state',
    nullable: true,
    length: 255,
    default: () => "'CO'",
  })
  state: string | null

  @Column('json', { name: 'their_relationship_status', nullable: true })
  theirRelationshipStatus: object | null

  @Column('character varying', {
    name: 'presence',
    nullable: true,
    length: 255,
    default: () => "'offline'",
  })
  presence: string | null

  @Column('boolean', { name: 'signed_waiver', default: () => 'false' })
  signedWaiver: boolean

  @Column('integer', { name: 'birth_month', nullable: true })
  birthMonth: number | null

  @Column('integer', { name: 'birth_year', nullable: true })
  birthYear: number | null

  @Column('integer', { name: 'rating', default: () => '0' })
  rating: number

  @Column('boolean', { name: 'show_contact', default: () => 'false' })
  showContact: boolean

  @Column('boolean', {
    name: 'show_explicit',
    nullable: true,
    default: () => 'true',
  })
  showExplicit: boolean | null

  @Column('boolean', {
    name: 'show_location',
    nullable: true,
    default: () => 'true',
  })
  showLocation: boolean | null

  @Column('boolean', { name: 'show_events', default: () => 'true' })
  showEvents: boolean

  @Column('boolean', { name: 'show_photos', default: () => 'true' })
  showPhotos: boolean

  @Column('timestamp with time zone', {
    name: 'session_expire',
    nullable: true,
  })
  sessionExpire: Date | null

  @Column('character varying', {
    name: 'public_folder',
    nullable: true,
    length: 255,
  })
  publicFolder: string | null

  @Column('character varying', {
    name: 'private_folder',
    nullable: true,
    length: 255,
    default: () => 'NULL::character varying',
  })
  privateFolder: string | null

  @Column('boolean', {
    name: 'auth_with_phone',
    nullable: true,
    default: () => 'false',
  })
  authWithPhone: boolean | null

  @Column('date', { name: 'approved_date', nullable: true })
  approvedDate: string | null

  @Column('boolean', {
    name: 'show_explicit_roles',
    nullable: true,
    default: () => 'true',
  })
  showExplicitRoles: boolean | null

  @OneToMany(() => EventsUser, (eventsUsers) => eventsUsers.user)
  events: EventsUser[]

  @OneToMany(() => Location, (location) => location.owner)
  locations: Location[]

  @OneToMany(() => Messages, (messages) => messages.from)
  messages: Messages[]

  @OneToMany(() => NotificationsUsers, (notificationsUsers) => notificationsUsers.user)
  notificationsUsers: NotificationsUsers[]

  @OneToMany(() => Promos, (promos) => promos.vouchingUser)
  promos: Promos[]

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings: Rating[]

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings2: Rating[]

  @OneToMany(() => SurveyAnswers, (surveyAnswers) => surveyAnswers.user)
  surveyAnswers: SurveyAnswers[]

  @OneToMany(() => UserAccount, (userAccount) => userAccount.user)
  userAccounts: UserAccount[]

  @OneToMany(() => UserSession, (userSession) => userSession.user)
  userSessions: UserSession[]

  @OneToMany(() => UserContactAttempt, (userContactAttempt) => userContactAttempt.user)
  userContactAttempts: UserContactAttempt[]

  @OneToMany(() => UserEmailEvents, (userEmailEvents) => userEmailEvents.user)
  userEmailEvents: UserEmailEvents[]

  @OneToMany(() => UserRelationships, (userRelationships) => userRelationships.relatedUsers)
  userRelationships: UserRelationships[]

  @JoinColumn([{ name: 'approved_by', referencedColumnName: 'id' }])
  approvedBy: DirectusUsers

  @JoinColumn([{ name: 'photo', referencedColumnName: 'id' }])
  photo: DirectusFile

  @JoinColumn([{ name: 'picture', referencedColumnName: 'id' }])
  picture: DirectusFile

  @ManyToOne(() => Promos, (promos) => promos.users, { onDelete: 'SET NULL' })
  @JoinColumn([{ name: 'promo', referencedColumnName: 'id' }])
  promo: Promos

  @ManyToOne(() => User, (users) => users)
  @JoinColumn([{ name: 'vouched_by', referencedColumnName: 'id' }])
  vouchedBy: User

  @OneToMany(() => UserBuddy, (userBuddy) => userBuddy.buddy)
  buddy_of: UserBuddy[]

  @OneToMany(() => UserBuddy, (userBuddy) => userBuddy.user)
  buddies: UserBuddy[]

  @JoinColumn([{ name: 'waiver', referencedColumnName: 'id' }])
  waiver: DirectusFile

  @OneToMany(() => UsersFiles, (usersFiles) => usersFiles.user)
  usersFiles: UsersFiles[]

  @OneToMany(() => UsersPhotos, (usersPhotos) => usersPhotos.user)
  usersPhotos: UsersPhotos[]
}
