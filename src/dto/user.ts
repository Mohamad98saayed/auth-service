import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class UpdatePasswordInputModule {
     @IsString()
     @IsNotEmpty()
     oldPassword!: string;

     @IsString()
     @IsNotEmpty()
     newPassword!: string;
}

export class UpdateUserDetailsInputModel {
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
}