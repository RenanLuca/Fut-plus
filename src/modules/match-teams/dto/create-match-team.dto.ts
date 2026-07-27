import {
  IsHexColor,
  IsNotEmpty,
  IsString,
} from "class-validator";

export class CreateMatchTeamDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsHexColor()
  @IsString()
  color!: string;
}
