import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Index("directus_fields_pkey", ["id"], { unique: true })
@Entity("directus_fields", { schema: "public" })
export class DirectusFields {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "collection", length: 64 })
  collection: string;

  @Column("character varying", { name: "field", length: 64 })
  field: string;

  @Column("character varying", { name: "special", nullable: true, length: 64 })
  special: string | null;

  @Column("character varying", {
    name: "interface",
    nullable: true,
    length: 64,
  })
  interface: string | null;

  @Column("json", { name: "options", nullable: true })
  options: object | null;

  @Column("character varying", { name: "display", nullable: true, length: 64 })
  display: string | null;

  @Column("json", { name: "display_options", nullable: true })
  displayOptions: object | null;

  @Column("boolean", { name: "readonly", default: () => "false" })
  readonly: boolean;

  @Column("boolean", { name: "hidden", default: () => "false" })
  hidden: boolean;

  @Column("integer", { name: "sort", nullable: true })
  sort: number | null;

  @Column("character varying", {
    name: "width",
    nullable: true,
    length: 30,
    default: () => "'full'",
  })
  width: string | null;

  @Column("json", { name: "translations", nullable: true })
  translations: object | null;

  @Column("text", { name: "note", nullable: true })
  note: string | null;

  @Column("json", { name: "conditions", nullable: true })
  conditions: object | null;

  @Column("boolean", {
    name: "required",
    nullable: true,
    default: () => "false",
  })
  required: boolean | null;

  @Column("character varying", { name: "group", nullable: true, length: 64 })
  group: string | null;

  @Column("json", { name: "validation", nullable: true })
  validation: object | null;

  @Column("text", { name: "validation_message", nullable: true })
  validationMessage: string | null;
}
