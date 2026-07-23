import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGuestUserDto } from "./dto/create-guest-user.dto";
import { GuestUsersRepository } from "@src/shared/database/repositories/guest-users-repository";
import { GroupsRepository } from "@src/shared/database/repositories/groups-repository";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members-repository";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";

@Injectable()
export class GuestUsersService {
  constructor(
    private readonly guestUsersRepository: GuestUsersRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly groupMembersRepository: GroupMembersRepository,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
  ) {}
  async create(
    createGuestUserDto: CreateGuestUserDto,
    groupId: string,
    userId: string,
  ) {
    const { name, position, rank } = createGuestUserDto;
    await this.checkIfGroupExists(groupId);
    await this.userBelongsToGroupService.check(userId, groupId);
    const guestUser =
      await this.guestUsersRepository.createAndConnectToGroup(
        { name, position },
        groupId,
        rank,
      );

    return guestUser;
  }

  async findOne(
    userId: string,
    guestUserId: string,
    groupId: string,
  ) {
    await this.checkIfGroupExists(groupId);
    await this.userBelongsToGroupService.check(userId, groupId);
    const user = await this.checkIfGuestUserExistsInThisGroup(
      guestUserId,
      groupId,
    );
    return user;
  }

  async remove(
    userId: string,
    guestUserId: string,
    groupId: string,
  ) {
    await this.checkIfGroupExists(groupId);
    await this.userBelongsToGroupService.check(userId, groupId);
    await this.checkIfGuestUserExistsInThisGroup(
      guestUserId,
      groupId,
    );
    return await this.guestUsersRepository.delete({
      where: { id: guestUserId },
    });
  }

  private async checkIfGuestUserExistsInThisGroup(
    id: string,
    groupId: string,
  ) {
    const guestUser = await this.guestUsersRepository.findFirst({
      where: {
        id,
        groupMembers: {
          some: { groupId },
        },
      },
    });
    if (!guestUser) {
      throw new NotFoundException(`Guest user not found`);
    }
    return guestUser;
  }

  private async checkIfGroupExists(id: string) {
    const group = await this.groupsRepository.findUnique({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException(`Group not found`);
    }
    return group;
  }
}
