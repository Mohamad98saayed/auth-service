import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany, ManyToOne } from "typeorm";

// MODELS
import { User } from "./user";
import { AppBaseModel } from "./_base";
import { LicenseType } from "./licenseType";
import { LicenseImages } from "./licenseImage";

@Entity({ name: "licenses" })
export class License extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "is_valid" })
     isValid!: string;

     @Column({ name: "issue_date", type: "timestamptz" })
     issueDate!: Date;

     @Column({ name: "expiry_date", type: "timestamptz" })
     expiryDate!: Date;

     @Column({ name: "comment" })
     comment!: string;

     // RELATIONS
     @OneToMany(() => LicenseImages, (licenseImage) => licenseImage.licenseId)
     images!: LicenseImages[];

     @ManyToOne(() => LicenseType, (licenseType) => licenseType.licenses)
     @JoinColumn({ name: "license_type_id", referencedColumnName: "id" })
     licenseTypeId!: LicenseType;

     @ManyToOne(() => User, (user) => user.licenses, { nullable: true })
     @JoinColumn({ name: "user_id", referencedColumnName: "id" })
     userId!: User;
}
