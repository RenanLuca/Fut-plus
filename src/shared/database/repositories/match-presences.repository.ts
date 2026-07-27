import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class MatchPresencesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async upsert(
    upsertMatchPresenceDto: Prisma.GroupMatchPresenceUpsertArgs,
  ) {
    return this.prisma.groupMatchPresence.upsert({
      ...upsertMatchPresenceDto,
      create: upsertMatchPresenceDto.create,
    });
  }
}
