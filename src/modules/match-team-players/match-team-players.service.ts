import { ConflictException, Injectable } from "@nestjs/common";
import { MatchTeamRosterDto } from "./dto/match-team-roster.dto";
import { GroupMatchesService } from "../group-matches/group-matches.service";
import { MatchTeamsService } from "../match-teams/match-teams.service";
import { MatchTeamsPlayersRepository } from "@src/shared/database/repositories/match-team-players.repository";
import { MatchTeamPlayerDto } from "./dto/match-team-player.dto";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";

@Injectable()
export class MatchTeamPlayersService {
  constructor(
    private readonly groupMatchesService: GroupMatchesService,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
    private readonly matchTeamsService: MatchTeamsService,
    private readonly matchTeamPlayersRepository: MatchTeamsPlayersRepository,
  ) {}
  async replaceAll(
    groupId: string,
    matchId: string,
    teams: MatchTeamRosterDto[],
  ) {
    this.checkNoDuplicatePlayersInPayload(teams);
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });
    await Promise.all(
      teams.map(async (team) => {
        await this.matchTeamsService.checkIfMatchTeamBelongsToMatch(
          {
            matchId,
            matchTeamId: team.matchTeamId,
          },
        );
        await Promise.all(
          team.players.map(async (player) => {
            const memberId = player.userId ?? player.guestUserId;
            if (!memberId) return;
            await this.userBelongsToGroupService.check({
              memberId,
              groupId,
              type: player.userId ? "user" : "guest",
            });
          }),
        );
      }),
    );
    const teamsId = teams.map((team) => team.matchTeamId);
    const createTeamPlayersDto = {
      data: teams.flatMap((team) =>
        team.players.map((player) => ({
          matchTeamId: team.matchTeamId,
          groupMatchId: matchId,
          userId: player.userId,
          guestUserId: player.guestUserId,
        })),
      ),
    };
    await this.matchTeamPlayersRepository.replaceAllPlayers(
      createTeamPlayersDto,
      teamsId,
    );
  }

  async addPlayers({
    groupId,
    matchId,
    matchTeamId,
    players,
  }: {
    groupId: string;
    matchId: string;
    matchTeamId: string;
    players: MatchTeamPlayerDto[];
  }) {
    await this.groupMatchesService.checkIfMatchBelongsToGroup({
      groupId,
      matchId,
    });
    await this.matchTeamsService.checkIfMatchTeamBelongsToMatch({
      matchId,
      matchTeamId: matchTeamId,
    });
    await Promise.all(
      players.map(async (player) => {
        const memberId = player.userId ?? player.guestUserId;
        if (!memberId) return;
        await this.userBelongsToGroupService.check({
          memberId,
          groupId,
          type: player.userId ? "user" : "guest",
        });
        await this.checkPlayerNotAlreadyInMatch({
          matchId,
          userId: player.userId,
          guestUserId: player.guestUserId,
        });
      }),
    );
    return await this.matchTeamPlayersRepository.addPlayers({
      data: players.map((player) => ({
        matchTeamId,
        groupMatchId: matchId,
        userId: player.userId,
        guestUserId: player.guestUserId,
      })),
    });
  }

  private checkNoDuplicatePlayersInPayload(
    teams: MatchTeamRosterDto[],
  ) {
    const allMemberIds = teams.flatMap((team) =>
      team.players.map(
        (player) => player.userId ?? player.guestUserId,
      ),
    );

    const uniqueMemberIds = new Set(allMemberIds);
    if (uniqueMemberIds.size !== allMemberIds.length) {
      throw new ConflictException(
        "The same player cannot be assigned to more than one team",
      );
    }
  }

  private async checkPlayerNotAlreadyInMatch({
    matchId,
    userId,
    guestUserId,
  }: {
    matchId: string;
    userId?: string;
    guestUserId?: string;
  }) {
    const existing = await this.matchTeamPlayersRepository.findFirst({
      where: {
        groupMatchId: matchId,
        ...(userId ? { userId } : { guestUserId }),
      },
    });
    if (existing) {
      throw new ConflictException(
        "Player is already assigned to a team in this match",
      );
    }
  }
}
