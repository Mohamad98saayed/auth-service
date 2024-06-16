import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";

// MODELS
import { User } from "./user";
import { AppBaseModel } from "./_base";
import { DocumentType } from "./documentType";

@Entity({ name: "documents" })
export class Document extends AppBaseModel {
     @PrimaryGeneratedColumn('uuid', { name: "id" })
     id!: string;

     @Column({ name: "path" })
     path!: string;

     @Column({ name: "name" })
     name!: string;

     @Column({ name: "comment" })
     comment!: string;

     // RELATIONS
     @ManyToOne(() => DocumentType, (documentType) => documentType.documents, { nullable: true })
     @JoinColumn({ name: "document_type_id", referencedColumnName: "id" })
     documentTypeId!: DocumentType;

     @ManyToOne(() => User, (user) => user.documents, { nullable: true })
     @JoinColumn({ name: "user_id", referencedColumnName: "id" })
     userId!: User;
}
