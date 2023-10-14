import { plural } from "pluralize";
import { Column, Entity, Relation, RelationId } from "typeorm-model-generator";

let pluralize: boolean = false;

export function enablePluralization(value: boolean) {
  pluralize = value;
}

export function relationIdName(
  relationId: RelationId,
  relation: Relation,
  owner?: Entity
): string {
  const columnOldName = relationId.fieldName;

  const isRelationToMany =
    relation.relationType === "OneToMany" ||
    relation.relationType === "ManyToMany";
  let newColumnName = columnOldName.replace(/[0-9]$/, "");

  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (isRelationToMany && pluralize) {
    newColumnName = plural(newColumnName);
  }

  return newColumnName;
}

export function relationName(relation: Relation, owner?: Entity): string {
  const columnOldName = relation.fieldName;

  const isRelationToMany =
    relation.relationType === "OneToMany" ||
    relation.relationType === "ManyToMany";
  let newColumnName = columnOldName.replace(/[0-9]$/, "");

  if (
    newColumnName.toLowerCase().endsWith("id") &&
    !newColumnName.toLowerCase().endsWith("guid")
  ) {
    newColumnName = newColumnName.substring(
      0,
      newColumnName.toLowerCase().lastIndexOf("id")
    );
  }
  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (!Number.isNaN(parseInt(newColumnName[newColumnName.length - 1], 10))) {
    newColumnName = newColumnName.substring(0, newColumnName.length - 1);
  }
  if (isRelationToMany && pluralize) {
    newColumnName = plural(newColumnName);
  }
  return newColumnName;
}

export function entityName(oldEntityName: string, entity?: Entity): string {
  return oldEntityName;
}

export function columnName(oldColumnName: string, column?: Column): string {
  return oldColumnName;
}

export function fileName(oldFileName: string): string {
  return oldFileName;
}
