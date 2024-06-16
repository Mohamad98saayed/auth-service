import { BaseEntity, CreateDateColumn, UpdateDateColumn, Entity, Column } from "typeorm";

@Entity()
export class AppBaseModel extends BaseEntity {
     @CreateDateColumn({ name: "created_at", type: "timestamptz" })
     createdAt!: Date;

     @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
     updatedAt!: Date;

     @Column({ name: "created_by", nullable: true })
     createdBy!: string;

     @Column({ name: "updated_by", nullable: true })
     updatedBy!: string;
}