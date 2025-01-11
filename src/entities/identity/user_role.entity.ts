import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "authentication", name: "user_roles" })
export class UserRole {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid", nullable: false })
  userId!: string;

  @Column({ type: "uuid", nullable: false })
  roleId!: string;
}
