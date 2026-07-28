import { IsInt, Min } from "class-validator";

export class GenerateMatchTeamsDto {
  @IsInt()
  @Min(2)
  teamCount!: number;
}
