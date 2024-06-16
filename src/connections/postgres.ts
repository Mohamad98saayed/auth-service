import dotenv from "dotenv";
import { DataSource, Repository } from "typeorm";

// DOTENV CONFIGURATION
dotenv.config();

// MODELS
import { User } from "@/models/postgres/user";
import { Role } from "@/models/postgres/role";
import { Avatar } from "@/models/postgres/avatar";
import { Address } from "@/models/postgres/address";
import { License } from "@/models/postgres/license";
import { Document } from "@/models/postgres/documents";
import { LicenseType } from "@/models/postgres/licenseType";
import { DocumentType } from "@/models/postgres/documentType";
import { LicenseImages } from "@/models/postgres/licenseImage";

// CHECK IF DB EXISTS
export const checkDB = async () => {
     try {
          const connection = new DataSource({
               type: "postgres",
               host: process.env.POSTGRES_HOST,
               port: Number(process.env.POSTGRES_PORT),
               username: process.env.POSTGRES_USER,
               password: process.env.POSTGRES_PASS,
          }).initialize();

          const queryRunner = (await connection).createQueryRunner();
          const databaseExists = await queryRunner.hasDatabase(process.env.POSTGRES_NAME!);

          if (!databaseExists) {
               await queryRunner.createDatabase(process.env.POSTGRES_NAME!, true);
          }
     } catch (error) {
          console.error('error creating database', error);
     }
}

// POSTGRES SERVER
export const postgresServer = new DataSource({
     type: "postgres",
     host: process.env.POSTGRES_HOST,
     port: Number(process.env.POSTGRES_PORT),
     username: process.env.POSTGRES_USER,
     password: process.env.POSTGRES_PASS,
     database: process.env.POSTGRES_NAME,
     entities: [User, Role, Avatar, Address, License, LicenseImages, LicenseType, Document, DocumentType],
     synchronize: true,
})

// CONNECTING TO THE DB SERVER
export const postgresConnection = async () => {
     postgresServer
          .initialize()
          .then(() => console.log("postgres connected"));
}

// REPOSITORIES
export const userRepo: Repository<User> = postgresServer.getRepository(User);
export const roleRepo: Repository<Role> = postgresServer.getRepository(Role);
export const avatarRepo: Repository<Avatar> = postgresServer.getRepository(Avatar);
export const addressRepo: Repository<Address> = postgresServer.getRepository(Address);
export const licenseRepo: Repository<License> = postgresServer.getRepository(License);
export const documentRepo: Repository<Document> = postgresServer.getRepository(Document);
export const licenseTypeRepo: Repository<LicenseType> = postgresServer.getRepository(LicenseType);
export const documentTypeRepo: Repository<DocumentType> = postgresServer.getRepository(DocumentType);
export const licenseImageRepo: Repository<LicenseImages> = postgresServer.getRepository(LicenseImages);