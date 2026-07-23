import { PositionEnum } from "@src/shared/enum/positionEnum";
import { UserRank } from "@src/shared/enum/userRank";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateGuestUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsEnum(PositionEnum)
  @IsNotEmpty()
  position!: PositionEnum;
  @IsUUID()
  @IsNotEmpty()
  groupId!: string;
  @IsEnum(UserRank)
  @IsOptional()
  rank?: UserRank;
}
