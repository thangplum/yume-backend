import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class UserLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
