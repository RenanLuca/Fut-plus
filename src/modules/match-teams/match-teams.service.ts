import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMatchTeamDto } from "./dto/create-match-team.dto";
import { UpdateMatchTeamDto } from "./dto/update-match-team.dto";
import { MatchTeamsRepository } from "@src/shared/database/repositories/match-teams.repository";
import { GroupMatchesService } from "../group-matches/group-matches.service";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";

@Injectable()
export class MatchTeamsService {
  constructor(
    private readonly matchTeamsRepository: MatchTeamsRepository,
    private readonly groupMatchesService: GroupMatchesService,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
  ) {}
  async create(
    createMatchTeamDto: CreateMatchTeamDto,
    matchId: string,
    groupId: string,
  ) {
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });
    return await this.matchTeamsRepository.create({
      data: {
        ...createMatchTeamDto,
        groupMatchId: matchId,
      },
    });
  }

  async findAll(
    matchId: string,
    groupId: string,
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

    return await this.matchTeamsRepository.findAll({
      where: {
        groupMatchId: matchId,
      },
    });
  }

  async findOne(
    matchTeamId: string,
    matchId: string,
    groupId: string,
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
    return await this.checkIfMatchTeamBelongsToMatch({
      matchTeamId,
      matchId,
    });
  }

  async update(
    matchTeamId: string,
    matchId: string,
    groupId: string,
    updateMatchTeamDto: UpdateMatchTeamDto,
  ) {
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });
    await this.checkIfMatchTeamBelongsToMatch({
      matchTeamId,
      matchId,
    });

    return this.matchTeamsRepository.update({
      where: {
        id: matchTeamId,
      },
      data: {
        ...updateMatchTeamDto,
      },
    });
  }

  async checkIfMatchTeamBelongsToMatch({
    matchTeamId,
    matchId,
  }: {
    matchTeamId: string;
    matchId: string;
  }) {
    const matchTeam = await this.matchTeamsRepository.findFirst({
      where: {
        id: matchTeamId,
        groupMatchId: matchId,
      },
    });
    if (!matchTeam) {
      throw new NotFoundException(
        "Match team not found in this match",
      );
    }
    return matchTeam;
  }
}
