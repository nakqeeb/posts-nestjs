import { IsEmail, IsString, MinLength } from "class-validator";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class SignUpUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
