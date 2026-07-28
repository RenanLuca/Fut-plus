import { IsOptional, IsUrl, IsUUID } from "class-validator";

export class CreateGroupPaymentDto {
  @IsUrl()
  @IsOptional()
  receipt?: string;
  @IsOptional()
  @IsUUID()
  matchId?: string;
}
