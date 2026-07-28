import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class MatchTeamsPlayersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst(
    findFirstMatchTeamPlayerDto: Prisma.MatchTeamPlayerFindFirstArgs,
  ) {
    return this.prisma.matchTeamPlayer.findFirst(
      findFirstMatchTeamPlayerDto,
    );
  }

  async replaceAllPlayers(
    createTeamPlayersDto: Prisma.MatchTeamPlayerCreateManyArgs,
    teamsId: string[],
  ) {
    return await this.prisma.$transaction(async (tx) => {
      await tx.matchTeamPlayer.deleteMany({
        where: { matchTeamId: { in: teamsId } },
      });
      return tx.matchTeamPlayer.createMany(createTeamPlayersDto);
    });
  }

  async addPlayers(
    createTeamPlayersDto: Prisma.MatchTeamPlayerCreateManyArgs,
  ) {
    return await this.prisma.matchTeamPlayer.createMany(
      createTeamPlayersDto,
    );
  }
}
