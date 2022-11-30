import { IsString, IsEmail, MinLength } from "class-validator";

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
