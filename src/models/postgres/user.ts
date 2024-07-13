import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany, ManyToOne, BeforeInsert, BeforeUpdate } from "typeorm";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

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

     @Column({ name: "phone", unique: true })
     phone!: string;

     @Column({ name: "email", unique: true })
     email!: string;

     @Column({ name: "username", unique: true })
     username!: string;

     @Column({ name: "password" })
     password!: string;

     @Column({ name: "password_reset_token", nullable: true })
     passwordResetToken!: string;

     @Column({ name: "password_reset_token_expiry", type: "timestamptz", nullable: true })
     passwordResetTokenExpiry!: Date;

     @Column({ name: "is_active", default: false })
     isActive!: boolean;

     @Column({ name: "email_verification_token", nullable: true })
     emailVerificationToken!: string;

     @Column({ name: "privleges_id", unique: true })
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

     // hash password before saving
     @BeforeInsert()
     @BeforeUpdate()
     async hashPassword() {
          this.password = await bcrypt.hash(this.password, 12);
     }

     // compare passwords
     async comparePassword(plainTextPassword: string): Promise<boolean> {
          return await bcrypt.compare(plainTextPassword, this.password);
     }

     // generate a new reset token
     async getPasswordResetToken() {
          // generate a new token
          const randomBytes = crypto.randomBytes(20).toString("hex");
          const resetToken = crypto.createHash("sha256").update(randomBytes).digest("hex");

          // save it to the user
          this.passwordResetToken = resetToken;
          this.passwordResetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

          // save the changes & preventing listeners
          await this.save({ listeners: false });

          // return the token
          return resetToken;
     }

     async getEmailVerificationToken() {
          // generate a new token
          const randomBytes = crypto.randomBytes(20).toString("hex");
          const emailVerificationToken = crypto.createHash("sha256").update(randomBytes).digest("hex");

          // save it to user
          this.emailVerificationToken = emailVerificationToken;

          // save it to user
          await this.save({ listeners: false });

          return emailVerificationToken;
     }
}
