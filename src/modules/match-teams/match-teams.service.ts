import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMatchTeamDto } from "./dto/create-match-team.dto";
import { UpdateMatchTeamDto } from "./dto/update-match-team.dto";
import { GenerateMatchTeamsDto } from "./dto/generate-match-teams.dto";
import { MatchTeamsRepository } from "@src/shared/database/repositories/match-teams.repository";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members.repository";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";
import { balanceMembersIntoTeams } from "./utils/match-teams-balancer";
import { TEAM_COLORS } from "./constants/teamColors";
import { GroupMatchesService } from "../group-matches/services/group-matches.service";

@Injectable()
export class MatchTeamsService {
  constructor(
    private readonly matchTeamsRepository: MatchTeamsRepository,
    private readonly groupMembersRepository: GroupMembersRepository,
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

  async generate(
    groupId: string,
    matchId: string,
    generateMatchTeamsDto: GenerateMatchTeamsDto,
  ) {
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });

    const { teamCount } = generateMatchTeamsDto;

    const confirmedMembers =
      await this.groupMembersRepository.findMany({
        where: {
          groupId,
          OR: [
            {
              user: {
                groupMatchPresences: {
                  some: {
                    groupMatchId: matchId,
                    isPresent: true,
                  },
                },
              },
            },
            {
              guestUser: {
                groupMatchPresences: {
                  some: {
                    groupMatchId: matchId,
                    isPresent: true,
                  },
                },
              },
            },
          ],
        },
        select: {
          userId: true,
          guestUserId: true,
          rank: true,
          user: { select: { position: true } },
          guestUser: { select: { position: true } },
        },
      });

    const membersForBalancing = confirmedMembers.map(
      (member) => ({
        userId: member.userId,
        guestUserId: member.guestUserId,
        rank: member.rank,
        position: (member.user?.position ??
          member.guestUser?.position)!,
      }),
    );

    const teamsAssignments = balanceMembersIntoTeams(
      membersForBalancing,
      teamCount,
    );

    const teams = teamsAssignments.map((players, index) => ({
      name: `Time ${index + 1}`,
      color: TEAM_COLORS[index % TEAM_COLORS.length],
      players,
    }));

    return this.matchTeamsRepository.regenerateTeams({
      groupMatchId: matchId,
      teams,
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
