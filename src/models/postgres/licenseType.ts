import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

// MODELS
import { License } from "./license";
import { AppBaseModel } from "./_base";

@Entity({ name: "license_types" })
export class LicenseType extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "name" })
     name!: string;

     // RELATIONS
     @OneToMany(() => License, (license) => license.licenseTypeId, { nullable: true })
     licenses!: License[];
}
