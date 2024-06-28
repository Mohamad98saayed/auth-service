import { Column, Entity, PrimaryGeneratedColumn, OneToOne, OneToMany } from "typeorm";

// MODELS
import { User } from "./user";
import { AppBaseModel } from "./_base";

@Entity({ name: "roles" })
export class Role extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "name" })
     name!: string;

     @Column({ name: "privleges_template_id" })
     privlegesTemplateId!: string;

     // RELATIONS
     @OneToMany(() => User, (user) => user.roleId, { nullable: true })
     users!: User[];
}
