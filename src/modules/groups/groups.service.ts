import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { GroupsRepository } from "@src/shared/database/repositories/groups-repository";
import { GroupMembersRepository } from "@src/shared/database/repositories/group-members-repository";
import { UserBelongsToGroupService } from "./services/userBelongsToGroup.service";

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly userBelongsToGroupService: UserBelongsToGroupService,
  ) {}
  async create(createGroupDto: CreateGroupDto, ownerId: string) {
    return this.groupsRepository.createWithOwner(
      { ...createGroupDto, ownerId },
      ownerId,
    );
  }

  findAll(userId: string) {
    return this.groupsRepository.findMany({
      where: {
        groupMembers: {
          some: { userId },
        },
      },
    });
  }
  async findOne(userId: string, id: string) {
    await this.userBelongsToGroupService.check(userId, id);
    await this.checkIfGroupExists(id);
    return await this.groupsRepository.findUnique({
      where: { id },
    });
  }

  async update(
    groupId: string,
    updateGroupDto: UpdateGroupDto,
    userId: string,
  ) {
    await this.checkIfUserIsOwner(groupId, userId);
    await this.checkIfGroupExists(groupId);
    return await this.groupsRepository.update({
      where: { id: groupId },
      data: updateGroupDto,
    });
  }

  async remove(groupId: string, userId: string) {
    await this.checkIfUserIsOwner(groupId, userId);
    await this.checkIfGroupExists(groupId);
    return await this.groupsRepository.delete({
      where: { id: groupId },
    });
  }

  private async checkIfGroupExists(id: string) {
    const group = await this.groupsRepository.findUnique({
      where: { id },
    });
    if (!group) {
      throw new NotFoundException(`Group not found`);
    }
    return group;
  }

  private async checkIfUserIsOwner(
    groupId: string,
    userId: string,
  ) {
    const group = await this.checkIfGroupExists(groupId);
    if (group.ownerId !== userId) {
      throw new ForbiddenException(
        `User is not the owner of the group`,
      );
    }
  }
}
