import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from "@nestjs/common";
import { GroupMatchesService } from "./services/group-matches.service";
import { CreateGroupMatchDto } from "./dto/create-group-match.dto";
import { ActiveUserId } from "@src/shared/decorators/ActiveUserId";
import { GroupOwnerGuard } from "../groups/guards/group-owner.guard";

@Controller("groups/:groupId/group-matches")
export class GroupMatchesController {
  constructor(
    private readonly groupMatchesService: GroupMatchesService,
  ) {}

  @UseGuards(GroupOwnerGuard)
  @Post()
  create(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Body() createGroupMatchDto: CreateGroupMatchDto,
  ) {
    return this.groupMatchesService.create(
      groupId,
      createGroupMatchDto,
    );
  }

  @Get()
  findAll(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.groupMatchesService.findAll(groupId, userId);
  }

  @Get(":matchId")
  findOne(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.groupMatchesService.findOne({
      groupId,
      matchId,
      userId,
    });
  }

  @UseGuards(GroupOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(":matchId")
  remove(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("matchId", ParseUUIDPipe) matchId: string,
  ) {
    return this.groupMatchesService.remove(groupId, matchId);
  }
}
