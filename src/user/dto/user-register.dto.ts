import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
