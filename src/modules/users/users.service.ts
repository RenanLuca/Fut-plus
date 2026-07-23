import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersRepository } from "@src/shared/database/repositories/users.repository";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  private async verifyUserExists(userId: string) {
    const user = await this.usersRepository.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  private async verifyEmailAvailability(email: string) {
    const user = await this.usersRepository.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      throw new ConflictException("Email is already in use");
    }
  }

  async getUserById(userId: string) {
    const user = await this.verifyUserExists(userId);
    const { hashedPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    await this.verifyUserExists(userId);
    if (updateUserDto.email) {
      await this.verifyEmailAvailability(updateUserDto.email);
    }
    const updatedUser = await this.usersRepository.update({
      where: {
        id: userId,
      },
      data: updateUserDto,
    });
    const { hashedPassword, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(userId: string) {
    await this.verifyUserExists(userId);
    return this.usersRepository.delete({
      where: {
        id: userId,
      },
    });
  }
}
