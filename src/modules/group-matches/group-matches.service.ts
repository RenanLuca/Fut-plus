import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { CreateGroupMatchDto } from "./dto/create-group-match.dto";
import { GroupMatchesRepository } from "../../shared/database/repositories/group-matches.repository";
import { UserBelongsToGroupService } from "../groups/services/userBelongsToGroup.service";

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
    await this.usersBelongToGroupService.check(userId, groupId);
    return this.groupMatchesRepository.findMany({
      where: {
        groupId,
      },
    });
  }

  async findOne(
    groupId: string,
    matchId: string,
    userId: string,
  ) {
    await this.usersBelongToGroupService.check(userId, groupId);
    await this.checkIfMatchBelongsToGroup(groupId, matchId);
    return await this.groupMatchesRepository.findOne({
      where: {
        id: matchId,
        groupId,
      },
      include: {
        groupMatchPresences: {
          include: {
            user: {
              select: {
                name: true,
                id: true,
                position: true,
                profilePicture: true,
              },
            },
            guestUser: true,
          },
        },
        matchTeams: {
          include: {
            matchTeamPlayers: {
              include: {
                user: {
                  select: {
                    name: true,
                    id: true,
                    position: true,
                    profilePicture: true,
                  },
                },
                guestUser: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(groupId: string, matchId: string) {
    await this.checkIfMatchBelongsToGroup(groupId, matchId);
    return this.groupMatchesRepository.delete({
      where: { id: matchId },
    });
  }

  async checkIfMatchBelongsToGroup(
    groupId: string,
    matchId: string,
  ) {
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
