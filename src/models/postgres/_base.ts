import { BaseEntity, CreateDateColumn, UpdateDateColumn, Entity, Column, DeleteDateColumn } from "typeorm";

@Entity()
export class AppBaseModel extends BaseEntity {
     @CreateDateColumn({ name: "created_at", type: "timestamptz" })
     createdAt!: Date;

     @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
     updatedAt!: Date;

     @DeleteDateColumn({ name: "deleted_at", type: "timestamptz" })
     deletedAt!: Date;

     @Column({ name: "created_by", nullable: true })
     createdBy!: string;

     @Column({ name: "updated_by", nullable: true })
     updatedBy!: string;

     @Column({ name: "deleted_by", nullable: true })
     deletedBy!: string;
}