import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

// MODELS
import { License } from "./license";
import { AppBaseModel } from "./_base";

@Entity({ name: "license_images" })
export class LicenseImages extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "path" })
     path!: string;

     @Column({ name: "comment" })
     comment!: string;

     @ManyToOne(() => License, (license) => license.images)
     @JoinColumn({ name: "license_id", referencedColumnName: "id" })
     licenseId!: License;
}
