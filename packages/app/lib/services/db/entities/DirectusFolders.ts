import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { DirectusFile } from './DirectusFiles'

@Index('directus_folders_pkey', ['id'], { unique: true })
@Entity('directus_folders', { schema: 'public' })
export class DirectusFolders {
  @Column('uuid', { primary: true, name: 'id' })
  id: string

  @Column('character varying', { name: 'name', length: 255 })
  name: string

  @OneToMany(() => DirectusFile, (directusFiles) => directusFiles.folder)
  directusFiles: DirectusFile[]

  @ManyToOne(() => DirectusFolders, (directusFolders) => directusFolders.directusFolders)
  @JoinColumn([{ name: 'parent', referencedColumnName: 'id' }])
  parent: DirectusFolders

  @OneToMany(() => DirectusFolders, (directusFolders) => directusFolders.parent)
  directusFolders: DirectusFolders[]
}
