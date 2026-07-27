import { ForbiddenException, Injectable } from "@nestjs/common";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members.repository";

export type GroupMemberIdentifierType = "user" | "guest";

@Injectable()
export class UserBelongsToGroupService {
  constructor(
    private readonly groupMembersRepository: GroupMembersRepository,
  ) {}
  async check({
    memberId,
    groupId,
    type = "user",
  }: {
    memberId: string;
    groupId: string;
    type?: GroupMemberIdentifierType;
  }) {
    const where =
      type === "user"
        ? { groupId_userId: { groupId, userId: memberId } }
        : { groupId_guestUserId: { groupId, guestUserId: memberId } };

    const groupMember =
      await this.groupMembersRepository.findUnique({
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
