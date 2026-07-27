import { Injectable } from "@nestjs/common";
import { UpdateMatchPresenceDto } from "./dto/updateMatchPresence.dto";
import { MatchPresencesRepository } from "@src/shared/database/repositories/match-presences.repository";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";
import { GroupMatchesService } from "../group-matches/group-matches.service";

@Injectable()
export class MatchPresencesService {
  constructor(
    private readonly matchPresencesRepository: MatchPresencesRepository,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
    private readonly groupMatchesService: GroupMatchesService,
  ) {}

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
}
