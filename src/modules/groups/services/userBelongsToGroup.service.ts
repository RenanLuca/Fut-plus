import { ForbiddenException, Injectable } from "@nestjs/common";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members-repository";

export type GroupMemberIdentifierType = "user" | "guest";

@Injectable()
export class UserBelongsToGroupService {
  constructor(
    private readonly groupMembersRepository: GroupMembersRepository,
  ) {}
  async check(
    id: string,
    groupId: string,
    type: GroupMemberIdentifierType = "user",
  ) {
    const where =
      type === "user"
        ? { groupId_userId: { groupId, userId: id } }
        : { groupId_guestUserId: { groupId, guestUserId: id } };

    const groupMember = await this.groupMembersRepository.findUnique({
      where,
    });
    if (!groupMember) {
      throw new ForbiddenException(
        `Member does not belong to the group`,
      );
    }

    return { isMember: !!groupMember };
  }
}
