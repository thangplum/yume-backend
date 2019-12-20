import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserPermissions } from './user.entity';
import { Repository, PrimaryGeneratedColumn } from 'typeorm';
import { UserRegisterDTO } from './dto/user-register.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { UserResponseDTO } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async showAll(page: number = 1): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.find({
      relations: ['bookmarks'],
      take: 25,
      skip: 25 * (page - 1),
    });
    return users.map(user => user.toResponseObject(false));
  }

  async read(username: string) {
    const user = await this.userRepository.find({
      where: { username },
      relations: ['bookmarks'],
    });
    if (!user.length) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    return user[0].toResponseObject(false);
  }

  async login(data: UserLoginDTO): Promise<UserResponseDTO> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_GATEWAY,
      );
    }
    return user.toResponseObject();
  }

  async register(data: UserRegisterDTO): Promise<UserResponseDTO> {
    const { email, username } = data;
    let user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      throw new HttpException('Username is taken', HttpStatus.BAD_REQUEST);
    }

    user = await this.userRepository.create({
      ...data,
      permission: UserPermissions.USER,
    });
    await this.userRepository.save(user);
    return user.toResponseObject();
  }

  async updateUser(
    id: string,
    firstName: string,
    lastName: string,
    major: string,
    college: string,
    location: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.major = major;
    user.college = college;
    user.location = location;
    const updatedUser = await this.userRepository.update(
      { id },
      {
        firstName,
        lastName,
        major,
        college,
        location,
      },
    );
    return user.toResponseObject();
  }
}
