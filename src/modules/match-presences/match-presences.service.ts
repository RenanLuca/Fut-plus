import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateMatchPresenceDto } from "./dto/updateMatchPresence.dto";
import { MatchPresencesRepository } from "@src/shared/database/repositories/match-presences.repository";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members.repository";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";
import { GroupMatchesService } from "../group-matches/services/group-matches.service";
import { Position } from "../../../generated/prisma/client";

type MatchPresenceMember = {
  id: string;
  name: string;
  position: Position;
  profilePicture: string | null;
  isGuest: boolean;
};

@Injectable()
export class MatchPresencesService {
  constructor(
    private readonly matchPresencesRepository: MatchPresencesRepository,
    private readonly groupMembersRepository: GroupMembersRepository,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
    private readonly groupMatchesService: GroupMatchesService,
  ) {}

  async findMatchPresences(
    groupId: string,
    matchId: string,
    userId: string,
  ) {
    await this.userBelongsToGroupService.check({
      memberId: userId,
      groupId,
    });
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });

    const [members, presences] = await Promise.all([
      this.groupMembersRepository.findMany({
        where: { groupId },
        select: {
          userId: true,
          guestUserId: true,
          user: {
            select: {
              name: true,
              position: true,
              profilePicture: true,
            },
          },
          guestUser: {
            select: { name: true, position: true },
          },
        },
      }),
      this.matchPresencesRepository.findMany({
        where: { groupMatchId: matchId },
        select: { userId: true, guestUserId: true, isPresent: true },
      }),
    ]);

    const presenceByMember = new Map<string, boolean>();
    for (const presence of presences) {
      const memberId = presence.userId ?? presence.guestUserId;
      if (memberId) {
        presenceByMember.set(memberId, presence.isPresent);
      }
    }

    const confirmed: MatchPresenceMember[] = [];
    const declined: MatchPresenceMember[] = [];
    const pending: MatchPresenceMember[] = [];

    for (const member of members) {
      const memberId = member.userId ?? member.guestUserId;
      const name = member.user?.name ?? member.guestUser?.name;
      const position =
        member.user?.position ?? member.guestUser?.position;
      if (!memberId || !name || !position) continue;

      const entry: MatchPresenceMember = {
        id: memberId,
        name,
        position,
        profilePicture: member.user?.profilePicture ?? null,
        isGuest: !member.userId,
      };

      const isPresent = presenceByMember.get(memberId);
      if (isPresent === true) confirmed.push(entry);
      else if (isPresent === false) declined.push(entry);
      else pending.push(entry);
    }

    return { confirmed, declined, pending };
  }

  async updateMatchPresences(
    userId: string,
    groupId: string,
    matchId: string,
    updateMatchPresenceDto: UpdateMatchPresenceDto,
  ) {
    await this.userBelongsToGroupService.check({
      memberId: userId,
      groupId,
    });
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });
    await this.matchPresencesRepository.upsert({
      where: {
        groupMatchId_userId: { groupMatchId: matchId, userId },
      },
      create: {
        groupMatchId: matchId,
        userId,
        isPresent: updateMatchPresenceDto.isPresent,
      },
      update: {
        isPresent: updateMatchPresenceDto.isPresent,
      },
    });
    return {
      message: "Match presence updated successfully",
    };
  }

  async checkIfUserWentToMatch({
    userId,
    matchId,
  }: {
    userId: string;
    matchId: string;
  }) {
    const matchPresence =
      await this.matchPresencesRepository.findOne({
        where: {
          groupMatchId_userId: { groupMatchId: matchId, userId },
        },
        select: {
          groupMatch: {
            select: { matchDate: true },
          },
          isPresent: true,
          groupMatchId: true,
        },
      });
    if (!matchPresence?.groupMatch.matchDate) {
      throw new NotFoundException("Presence not found");
    }
    if (matchPresence.groupMatch.matchDate > new Date()) {
      throw new NotFoundException("Match has not happened yet");
    }
    return matchPresence.isPresent;
  }
}
