import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { DirectusFolders } from './DirectusFolders'
import { DirectusUsers } from './DirectusUsers'
import { Location } from './Location'
import { Messages } from './Messages'
import { Page } from './Page'
import { PageContent } from './PageContent'
import { SurveyAnswers } from './SurveyAnswers'
import { User } from './Users'
import { UsersFiles } from './UsersFiles'
import { UsersPhotos } from './UsersPhotos'

@Index('directus_files_pkey', ['id'], { unique: true })
@Entity('directus_files', { schema: 'public' })
export class DirectusFiles {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column('character varying', { name: 'storage', length: 255 })
  storage: string

  @Column('character varying', {
    name: 'filename_disk',
    nullable: true,
    length: 255,
  })
  filenameDisk: string | null

  @Column('character varying', { name: 'filename_download', length: 255 })
  filenameDownload: string

  @Column('character varying', { name: 'title', nullable: true, length: 255 })
  title: string | null

  @Column('character varying', { name: 'type', nullable: true, length: 255 })
  type: string | null

  @Column('timestamp with time zone', {
    name: 'uploaded_on',
    default: () => 'CURRENT_TIMESTAMP',
  })
  uploadedOn: Date

  @Column('timestamp with time zone', {
    name: 'modified_on',
    default: () => 'CURRENT_TIMESTAMP',
  })
  modifiedOn: Date

  @Column('character varying', { name: 'charset', nullable: true, length: 50 })
  charset: string | null

  @Column('bigint', { name: 'filesize', nullable: true })
  filesize: string | null

  @Column('integer', { name: 'width', nullable: true })
  width: number | null

  @Column('integer', { name: 'height', nullable: true })
  height: number | null

  @Column('integer', { name: 'duration', nullable: true })
  duration: number | null

  @Column('character varying', { name: 'embed', nullable: true, length: 200 })
  embed: string | null

  @Column('text', { name: 'description', nullable: true })
  description: string | null

  @Column('text', { name: 'location', nullable: true })
  location: string | null

  @Column('text', { name: 'tags', nullable: true })
  tags: string | null

  @Column('json', { name: 'metadata', nullable: true })
  metadata: object | null

  @ManyToOne(() => DirectusFolders, (directusFolders) => directusFolders.directusFiles, {
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'folder', referencedColumnName: 'id' }])
  folder: DirectusFolders

  @OneToMany(() => Location, (location) => location.logo)
  locations: Location[]

  @OneToMany(() => Messages, (messages) => messages.image)
  messages: Messages[]

  @OneToMany(() => Page, (page) => page.image)
  pages: Page[]

  @OneToMany(() => PageContent, (pageContent) => pageContent.image)
  pageContents: PageContent[]

  @OneToMany(() => SurveyAnswers, (surveyAnswers) => surveyAnswers.answerFile)
  surveyAnswers: SurveyAnswers[]

  @OneToMany(() => SurveyAnswers, (surveyAnswers) => surveyAnswers.answerImage)
  surveyAnswers2: SurveyAnswers[]

  @OneToMany(() => User, (users) => users.photo)
  users: User[]

  @OneToMany(() => User, (users) => users.picture)
  users2: User[]

  @OneToMany(() => User, (users) => users.waiver)
  users3: User[]

  @OneToMany(() => UsersFiles, (usersFiles) => usersFiles.directusFiles)
  usersFiles: UsersFiles[]

  @OneToMany(() => UsersPhotos, (usersPhotos) => usersPhotos.directusFiles)
  usersPhotos: UsersPhotos[]
}
