import {
  Body,
  Controller,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { MatchTeamPlayersService } from "./match-team-players.service";
import { MatchTeamRosterDto } from "./dto/match-team-roster.dto";
import { GroupOwnerGuard } from "../groups/guards/group-owner.guard";
import { MatchTeamPlayerDto } from "./dto/match-team-player.dto";

@Controller(
  "groups/:groupId/group-matches/:matchId/match-team-players",
)
export class MatchTeamPlayersController {
  constructor(
    private readonly matchTeamPlayersService: MatchTeamPlayersService,
  ) {}
  @UseGuards(GroupOwnerGuard)
  @Post(":matchTeamId")
  addPlayers(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Param("matchTeamId", ParseUUIDPipe) matchTeamId: string,
    @Body(new ParseArrayPipe({ items: MatchTeamPlayerDto }))
    players: MatchTeamPlayerDto[],
  ) {
    return this.matchTeamPlayersService.addPlayers({
      groupId,
      matchId,
      matchTeamId,
      players,
    });
  }

  @UseGuards(GroupOwnerGuard)
  @Put()
  replaceAll(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Body(new ParseArrayPipe({ items: MatchTeamRosterDto }))
    teams: MatchTeamRosterDto[],
  ) {
    return this.matchTeamPlayersService.replaceAll(
      groupId,
      matchId,
      teams,
    );
  }
}
