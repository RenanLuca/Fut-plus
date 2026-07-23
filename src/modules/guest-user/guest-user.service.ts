import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGuestUserDto } from "./dto/create-guest-user.dto";
import { GuestUsersRepository } from "@src/shared/database/repositories/guest-users-repository";
import { GroupsRepository } from "@src/shared/database/repositories/groups-repository";
import { GroupsUsersRepository } from "@src/shared/database/repositories/groups-users-repository";
import { GroupUserType } from "@src/shared/enum/groupUserType";
import { UserRank } from "@src/shared/enum/userRank";

@Injectable()
export class GuestUserService {
  constructor(
    private readonly guestUsersRepository: GuestUsersRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsUsersRepository: GroupsUsersRepository,
  ) {}
  async create(createGuestUserDto: CreateGuestUserDto) {
    const { name, position, groupId, rank } = createGuestUserDto;
    const guestUser = await this.guestUsersRepository.create({
      data: {
        name,
        position,
      },
    });
    const groupUser = await this.connectGuestUserToGroup({
      groupId,
      guestUserId: guestUser.id,
      rank,
    });
    return {
      id: guestUser.id,
      name: guestUser.name,
      position: guestUser.position,
      groupId: groupUser.groupId,
      rank: groupUser.rank,
    };
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

  private async verifyIfGuestUserExists(id: string) {
    const guestUser = await this.guestUsersRepository.findUnique({
      where: { id },
    });
    if (!guestUser) {
      throw new NotFoundException(`Guest user not found`);
    }
    return guestUser;
  }

  private async verifyIfGroupExists(id: string) {
    const group = await this.groupsRepository.findUnique({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException(`Group not found`);
    }
    return group;
  }

  private async connectGuestUserToGroup({
    guestUserId,
    groupId,
    rank,
  }: {
    guestUserId: string;
    groupId: string;
    rank?: UserRank;
  }) {
    await this.verifyIfGroupExists(groupId);
    return await this.groupsUsersRepository.create({
      data: {
        guestUserId,
        groupId,
        type: GroupUserType.GUEST,
        rank,
      },
    });
  }
}
