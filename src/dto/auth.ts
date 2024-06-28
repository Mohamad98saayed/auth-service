import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class LoginInputModel {
     @IsEmail()
     email!: string

     @IsString()
     @IsNotEmpty()
     password!: string
}