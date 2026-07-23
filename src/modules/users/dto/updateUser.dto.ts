import { PositionEnum } from "@src/shared/enum/positionEnum";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(PositionEnum)
  @IsOptional()
  position?: PositionEnum;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsString()
  @IsOptional()
  telefone?: string;
}
