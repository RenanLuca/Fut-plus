import { IsUUID, ValidateIf } from "class-validator";

export class MatchTeamPlayerDto {
  @ValidateIf((player) => !player.guestUserId)
  @IsUUID()
  userId?: string;

  @ValidateIf((player) => !player.userId)
  @IsUUID()
  guestUserId?: string;
}
