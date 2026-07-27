import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { GroupMembersService } from "./group-members.service";
import { CreateGroupMemberDto } from "./dto/create-group-member.dto";
import { ActiveUserId } from "@src/shared/decorators/ActiveUserId";
import { GroupOwnerGuard } from "../groups/guards/group-owner.guard";

@Controller("groups/:groupId/group-members")
export class GroupMembersController {
  constructor(
    private readonly groupMembersService: GroupMembersService,
  ) {}

  @Get()
  findAllPerGroup(
    @Param("groupId") groupId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.groupMembersService.findMembersByGroupId(
      userId,
      groupId,
    );
  }

  @Post()
  create(
    @Param("groupId") groupId: string,
    @ActiveUserId() userId: string,
    @Body() createGroupMemberDto: CreateGroupMemberDto,
  ) {
    return this.groupMembersService.addGroupMember(
      groupId,
      createGroupMemberDto,
      userId,
    );
  }

  @UseGuards(GroupOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("user/:userId")
  removeUser(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("userId", ParseUUIDPipe) userId: string,
  ) {
    return this.groupMembersService.removeGroupMember(groupId, {
      userId,
    });
  }

  @UseGuards(GroupOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("guest/:guestUserId")
  removeGuest(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @Param("guestUserId", ParseUUIDPipe) guestUserId: string,
  ) {
    return this.groupMembersService.removeGroupMember(groupId, {
      guestUserId,
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete("leave")
  leaveGroup(
    @Param("groupId", ParseUUIDPipe) groupId: string,
    @ActiveUserId() userId: string,
  ) {
    return this.groupMembersService.removeGroupMember(groupId, {
      userId,
    });
  }
}
