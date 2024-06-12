import dotenv from "dotenv";
import { DataSource } from "typeorm";

// DOTENV CONFIGURATION
dotenv.config();

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
     entities: [],
     synchronize: true,
})

// CONNECTING TO THE DB SERVER
export const postgresConnection = async () => {
     postgresServer
          .initialize()
          .catch(error => console.error(error))
          .then(() => console.log("postgres connected"));
}