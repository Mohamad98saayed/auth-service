import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";

// MODELS
import { AppBaseModel } from "./_base";
import { User } from "./user";

@Entity({ name: "addresses" })
export class Address extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "name" })
     name!: string;

     @Column({ name: "address" })
     address!: string;

     @Column({ name: "phone" })
     phone!: string;

     @Column({ name: "comment" })
     comment!: string;

     // RELATIONS
     @ManyToOne(() => User, (user) => user.addresses, { nullable: true })
     @JoinColumn({ name: "user_id", referencedColumnName: "id" })
     userId!: User;
}
