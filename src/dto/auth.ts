import { IsString, IsNotEmpty, IsEmail } from "class-validator";

// MODELS
import { Role } from "@/models/postgres/role";

export class LoginInputModel {
     @IsEmail()
     email!: string

     @IsString()
     @IsNotEmpty()
     password!: string
}

export class CreateUserInputModel {
     @IsString()
     @IsNotEmpty()
     firstname!: string;

     @IsString()
     @IsNotEmpty()
     lastname!: string;

     @IsString()
     @IsNotEmpty()
     phone!: string;

     @IsEmail()
     email!: string;

     @IsString()
     @IsNotEmpty()
     password!: string;

     @IsString()
     @IsNotEmpty()
     roleId!: string;
}