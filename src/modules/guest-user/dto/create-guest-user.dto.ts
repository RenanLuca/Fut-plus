import { PositionEnum } from "@src/shared/enum/positionEnum";
import { IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";

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
}
