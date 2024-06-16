import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from "typeorm";

// MODELS
import { User } from "./user";
import { AppBaseModel } from "./_base";

@Entity({ name: "avatars" })
export class Avatar extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "path" })
     path!: string;

     // RELATIONS
     @OneToOne(() => User, (user) => user.avatarId, { nullable: true })
     userId!: User;
}
