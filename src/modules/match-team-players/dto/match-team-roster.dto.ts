import { Type } from "class-transformer";
import {
  IsArray,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { MatchTeamPlayerDto } from "./match-team-player.dto";

export class MatchTeamRosterDto {
  @IsUUID()
  matchTeamId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchTeamPlayerDto)
  players!: MatchTeamPlayerDto[];
}
