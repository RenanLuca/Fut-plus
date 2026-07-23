import { PositionEnum } from "@src/shared/enum/positionEnum";
import { UserRank } from "@src/shared/enum/userRank";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateGuestUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsEnum(PositionEnum)
  @IsNotEmpty()
  position!: PositionEnum;
  @IsEnum(UserRank)
  @IsOptional()
  rank?: UserRank;
}
