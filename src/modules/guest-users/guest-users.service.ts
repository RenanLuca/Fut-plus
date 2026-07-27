import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateGuestUserDto } from "./dto/create-guest-user.dto";
import { GuestUsersRepository } from "@src/shared/database/repositories/guest-users-repository";
import { GroupsRepository } from "@src/shared/database/repositories/groups-repository";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members-repository";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";
import { GroupsService } from "../groups/groups.service";

@Injectable()
export class GuestUsersService {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly guestUsersRepository: GuestUsersRepository,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
  ) {}
  async findOne(
    userId: string,
    guestUserId: string,
    groupId: string,
  ) {
    await this.groupsService.checkIfGroupExists(groupId);
    await this.userBelongsToGroupService.check(
      userId,
      groupId,
      "user",
    );
    const user = await this.guestUsersRepository.findFirst({
      where: {
        id: guestUserId,
        groupMembers: {
          some: { groupId },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`Guest user not found`);
    }
    return user;
  }
}
