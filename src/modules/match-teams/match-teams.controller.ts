import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from "@nestjs/common";
import { MatchTeamsService } from "./match-teams.service";
import { CreateMatchTeamDto } from "./dto/create-match-team.dto";
import { UpdateMatchTeamDto } from "./dto/update-match-team.dto";
import { GenerateMatchTeamsDto } from "./dto/generate-match-teams.dto";
import { GroupOwnerGuard } from "../groups/guards/group-owner.guard";
import { ActiveUserId } from "@src/shared/decorators/ActiveUserId";

@Controller("groups/:groupId/group-matches/:matchId/match-teams")
export class MatchTeamsController {
  constructor(
    private readonly matchTeamsService: MatchTeamsService,
  ) {}
  @UseGuards(GroupOwnerGuard)
  @Post()
  create(
    @Body() createMatchTeamDto: CreateMatchTeamDto,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Param("groupId", ParseUUIDPipe) groupId: string,
  ) {
    return this.matchTeamsService.create(
      createMatchTeamDto,
      matchId,
      groupId,
    );
  }

  @UseGuards(GroupOwnerGuard)
  @Post("generate")
  generate(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Body() generateMatchTeamsDto: GenerateMatchTeamsDto,
  ) {
    return this.matchTeamsService.generate(
      groupId,
      matchId,
      generateMatchTeamsDto,
    );
  }

  @Get()
  findAll(
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.matchTeamsService.findAll(
      matchId,
      groupId,
      userId,
    );
  }

  @Get(":matchTeamId")
  findOne(
    @Param("matchTeamId", ParseUUIDPipe) matchTeamId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.matchTeamsService.findOne(
      matchTeamId,
      matchId,
      groupId,
      userId,
    );
  }

  @UseGuards(GroupOwnerGuard)
  @Patch(":matchTeamId")
  update(
    @Param("matchTeamId", ParseUUIDPipe) matchTeamId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() updateMatchTeamDto: UpdateMatchTeamDto,
  ) {
    return this.matchTeamsService.update(
      matchTeamId,
      matchId,
      groupId,
      updateMatchTeamDto,
    );
  }
}
