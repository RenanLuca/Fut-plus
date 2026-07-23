import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGuestUserDto } from "./dto/create-guest-user.dto";
import { GuestUsersRepository } from "@src/shared/database/repositories/guest-users-repository";

@Injectable()
export class GuestUserService {
  constructor(private readonly guestUsersRepository: GuestUsersRepository) {}

  private async verifyIfThisNameIsAlreadyInUse(name: string) {
    const rawName = name.trim().toLowerCase();
    const guestUser = await this.guestUsersRepository.findFirst({
      where: { name: rawName },
    });
    if (guestUser) {
      throw new Error("This name is already in use");
    }
  }

  private async verifyIfGuestUserExists(id: string) {
    const guestUser = await this.guestUsersRepository.findUnique({
      where: { id },
    });
    if (!guestUser) {
      throw new NotFoundException(`Guest user not found`);
    }
    return guestUser;
  }

  async createGuestUserAndConnectToGroup(
    createGuestUserDto: CreateGuestUserDto,
  ) {
    const { name, position, groupId } = createGuestUserDto;
    await this.verifyIfThisNameIsAlreadyInUse(name);

    const rawName = name.trim().toLowerCase();
    const guestUser = await this.guestUsersRepository.create({
      data: {
        name: rawName,
        position,
      },
    });
    // TODO add guest user to the group with the given groupId
    return guestUser;
  }

  async findOne(id: string) {
    const user = await this.verifyIfGuestUserExists(id);
    return user;
  }

  async remove(id: string) {
    await this.verifyIfGuestUserExists(id);
    return await this.guestUsersRepository.delete({
      where: { id },
    });
  }
}
