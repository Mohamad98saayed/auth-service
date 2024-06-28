import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

// MODELS
import { Role } from "./role";
import { Avatar } from "./avatar";
import { Address } from "./address";
import { License } from "./license";
import { Document } from "./documents";
import { AppBaseModel } from "./_base";

@Entity({ name: "users" })
export class User extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "firstname" })
     firstname!: string;

     @Column({ name: "lastname" })
     lastname!: string;

     @Column({ name: "phone" })
     phone!: string;

     @Column({ name: "email" })
     email!: string;

     @Column({ name: "username" })
     username!: string;

     @Column({ name: "password" })
     password!: string;

     @Column({ name: "password_reset_token", type: "timestamptz", nullable: true })
     passwordResetToken!: Date;

     @Column({ name: "password_reset_token_expiry", type: "timestamptz", nullable: true })
     passwordResetTokenExpiry!: Date;

     @Column({ name: "is_active", default: false })
     isActive!: boolean;

     @Column({ name: "privleges_id" })
     privlegesId!: string;

     // RELATIONS
     @OneToOne(() => Avatar, (avatar) => avatar.userId, { nullable: true })
     @JoinColumn({ name: "avatar_id", referencedColumnName: "id" })
     avatarId!: Avatar;

     @ManyToOne(() => Role, (role) => role.users, { nullable: true })
     @JoinColumn({ name: "role_id", referencedColumnName: "id" })
     roleId!: Role;

     @OneToMany(() => Address, (address) => address.userId, { nullable: true })
     addresses!: Address[];

     @OneToMany(() => License, (license) => license.userId, { nullable: true })
     licenses!: License[];

     @OneToMany(() => Document, (document) => document.userId, { nullable: true })
     documents!: Document[];

     // TODO: company from different service
}
