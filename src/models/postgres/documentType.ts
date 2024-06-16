import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

// MODELS
import { AppBaseModel } from "./_base";
import { Document } from "./documents";

@Entity({ name: "document_types" })
export class DocumentType extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "name" })
     name!: string;

     // RELATIONS
     @OneToMany(() => Document, (document) => document.documentTypeId, { nullable: true })
     documents!: Document[];
}
