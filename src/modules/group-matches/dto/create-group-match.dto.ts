import { IsDateString, IsNotEmpty } from "class-validator";

export class CreateGroupMatchDto {
  @IsNotEmpty()
  @IsDateString()
  matchDate!: string;
}
