import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BaseEntity,
} from "typeorm";
import { AuditTracking } from "../../pkgs/entity/audit_entity";

@Entity({ schema: "authentication", name: "users" })
@Index(["email"], { unique: true })
@Index(["userName"], { unique: true })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  firstName?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  lastName?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  userName?: string;

  @Column({ type: "date", nullable: true })
  dateOfBirth?: Date;

  @Column({ type: "varchar", length: 256 })
  email!: string;

  @Column({ type: "smallint", default: 1 })
  userTypeId!: number;

  @Column({ type: "text", nullable: true })
  avatar?: string;

  @Column({ type: "boolean", default: false })
  twoFactorEnabled!: boolean;

  @Column({ type: "timestamptz", nullable: true })
  lockoutEnd?: Date;

  @Column({ type: "boolean", default: false })
  lockoutEnabled!: boolean;

  @Column({ type: "smallint", default: 0 })
  accessFailedCount!: number;

  @Column({ type: "boolean", default: false })
  emailConfirm!: boolean;

  @Column({ type: "text" })
  passwordHash!: string;

  @Column({ type: "smallint", nullable: true })
  timeZoneId?: number;

  @Column({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdDateTimeUTC!: Date;
  @Column({ type: "uuid", nullable: true })
  createdBy?: string;

  @Column({ type: "timestamptz", nullable: true })
  updatedDateTimeUTC?: Date;
  @Column({ type: "uuid", nullable: true })
  updatedBy?: string;

  fullname = function () {
    return `${this.firstName} ${this.lastName}`;
  };
}
