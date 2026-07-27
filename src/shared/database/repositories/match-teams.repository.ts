import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class MatchTeamsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createMatchTeamDto: Prisma.MatchTeamCreateArgs) {
    return this.prisma.matchTeam.create(createMatchTeamDto);
  }
  async findAll(
    findAllMatchTeamsDto: Prisma.MatchTeamFindManyArgs,
  ) {
    return this.prisma.matchTeam.findMany(findAllMatchTeamsDto);
  }
  async findOne(
    findOneMatchTeamDto: Prisma.MatchTeamFindUniqueArgs,
  ) {
    return this.prisma.matchTeam.findUnique(findOneMatchTeamDto);
  }
  async findFirst(
    findFirstMatchTeamDto: Prisma.MatchTeamFindFirstArgs,
  ) {
    return this.prisma.matchTeam.findFirst(findFirstMatchTeamDto);
  }
  async update(updateMatchTeamDto: Prisma.MatchTeamUpdateArgs) {
    return this.prisma.matchTeam.update(updateMatchTeamDto);
  }
}
