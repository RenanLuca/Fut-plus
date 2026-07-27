import { Injectable } from "@nestjs/common";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members-repository";
import { UsersService } from "../users/users.service";
import { GroupsService } from "../groups/groups.service";
import { GroupMemberType } from "@src/shared/enum/groupMemberType";
import { CreateGroupMemberDto } from "./dto/create-group-member.dto";
import { GuestUsersService } from "../guest-users/guest-users.service";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";

@Injectable()
export class GroupMembersService {
  constructor(
    private readonly groupMembersRepository: GroupMembersRepository,
    private readonly groupsService: GroupsService,
    private readonly usersService: UsersService,
    private readonly guestUsersService: GuestUsersService,
    private readonly usersBelongToGroupService: UserBelongsToGroupService,
  ) {}

  async addGroupMember(
    groupId: string,
    createGroupMemberDto: CreateGroupMemberDto,
    userId: string,
  ) {
    await this.groupsService.checkIfGroupExists(groupId);
    await this.usersService.checkIfUserExists(userId);
    const { type, rank } = createGroupMemberDto;

    if (type === "MONTHLY" || type === "DAILY") {
      return await this.groupMembersRepository.create({
        data: {
          groupId,
          userId,
          type: type,
          rank: rank,
        },
      });
    }

    return await this.guestUsersService.create(
      createGroupMemberDto,
      groupId,
      userId,
    );
  }

  async removeGroupMember(
    groupId: string,
    identifier: { userId?: string; guestUserId?: string },
  ) {
    await this.groupsService.checkIfGroupExists(groupId);
    await this.usersBelongToGroupService.check(
      identifier.userId || identifier.guestUserId!,
      groupId,
    );

    const where = identifier.userId
      ? {
          groupId_userId: { groupId, userId: identifier.userId },
        }
      : {
          groupId_guestUserId: {
            groupId,
            guestUserId: identifier.guestUserId!,
          },
        };

    await this.groupMembersRepository.delete({ where });
  }
  async findMembersByGroupId(userId: string, groupId: string) {
    await this.groupsService.checkIfGroupExists(groupId);
    await this.usersBelongToGroupService.check(userId, groupId);
    return this.groupMembersRepository.findMany({
      where: {
        groupId,
      },
    });
  }
}
