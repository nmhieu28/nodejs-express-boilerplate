import { Entity, Column, TableInheritance, BaseEntity } from "typeorm";

export class AuditTracking extends BaseEntity {
  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdDateTimeUTC!: Date;

  @Column({ type: "timestamp" })
  deletedDateTimeUTC?: Date;

  @Column({ type: "uuid", nullable: true })
  createdBy?: string;

  @Column({ type: "uuid", nullable: true })
  updatedBy?: string;
}
export class AuditSoftDelete extends AuditTracking {
  @Column({ type: "bit", default: 0 })
  isDeleted!: boolean;
}
