import { Injectable } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma/client";
import { PrismaService } from "../prisma.service";

@Injectable()
export class GroupPaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createGroupPaymentDto: Prisma.GroupPaymentCreateArgs,
  ) {
    return this.prisma.groupPayment.create(
      createGroupPaymentDto,
    );
  }
  async findUnique(
    findUniqueGroupPaymentDto: Prisma.GroupPaymentFindUniqueArgs,
  ) {
    return this.prisma.groupPayment.findUnique(
      findUniqueGroupPaymentDto,
    );
  }
  async update(
    updateGroupPaymentDto: Prisma.GroupPaymentUpdateArgs,
  ) {
    return this.prisma.groupPayment.update(
      updateGroupPaymentDto,
    );
  }
  async findMany(
    findManyGroupPaymentDto: Prisma.GroupPaymentFindManyArgs,
  ) {
    return this.prisma.groupPayment.findMany(
      findManyGroupPaymentDto,
    );
  }
  async count(countGroupPaymentDto: Prisma.GroupPaymentCountArgs) {
    return this.prisma.groupPayment.count(countGroupPaymentDto);
  }
}
