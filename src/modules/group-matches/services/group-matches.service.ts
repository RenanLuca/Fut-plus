import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { UserBelongsToGroupService } from "@src/modules/groups/services/userBelongsToGroup.service";
import { GroupMatchesRepository } from "@src/shared/database/repositories/group-matches.repository";
import { CreateGroupMatchDto } from "../dto/create-group-match.dto";

@Injectable()
export class GroupMatchesService {
  constructor(
    private readonly groupMatchesRepository: GroupMatchesRepository,
    private readonly usersBelongToGroupService: UserBelongsToGroupService,
  ) {}
  async create(
    groupId: string,
    createGroupMatchDto: CreateGroupMatchDto,
  ) {
    const { matchDate } = createGroupMatchDto;
    const dateIsInThePast = new Date(matchDate) < new Date();
    if (dateIsInThePast) {
      throw new BadRequestException(
        "Match date cannot be in the past",
      );
    }
    const existingMatchInThisDate =
      await this.groupMatchesRepository.findOne({
        where: {
          groupId,
          matchDate: new Date(matchDate),
        },
      });
    if (existingMatchInThisDate) {
      throw new ConflictException(
        "There's already a match scheduled for this date in this group",
      );
    }
    return this.groupMatchesRepository.create({
      data: {
        ...createGroupMatchDto,
        groupId,
      },
    });
  }

  async findAll(groupId: string, userId: string) {
    await this.usersBelongToGroupService.check({
      memberId: userId,
      groupId,
    });
    return this.groupMatchesRepository.findMany({
      where: {
        groupId,
      },
    });
  }

  async findOne({
    groupId,
    matchId,
    userId,
  }: {
    groupId: string;
    matchId: string;
    userId: string;
  }) {
    await this.usersBelongToGroupService.check({
      memberId: userId,
      groupId,
    });
    await this.checkIfMatchBelongsToGroup({ groupId, matchId });
    const match = await this.groupMatchesRepository.findOne({
      where: {
        id: matchId,
        groupId,
      },
    });
    if (!match) {
      throw new NotFoundException("Match not found");
    }
    return match;
  }

  async remove(groupId: string, matchId: string) {
    await this.checkIfMatchBelongsToGroup({ groupId, matchId });
    return this.groupMatchesRepository.delete({
      where: { id: matchId },
    });
  }

  async checkIfMatchBelongsToGroup({
    groupId,
    matchId,
  }: {
    groupId: string;
    matchId: string;
  }) {
    const match = await this.groupMatchesRepository.findOne({
      where: {
        id: matchId,
        groupId,
      },
    });
    if (!match) {
      throw new NotFoundException(
        "Match not found in this group",
      );
    }
    return match;
  }
}
