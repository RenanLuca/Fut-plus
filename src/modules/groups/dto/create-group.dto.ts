import { FrequencyType } from "@src/shared/enum/FrequencyType";
import { Weekday } from "../../../shared/enum/weekday";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
  @IsEnum(Weekday)
  @IsNotEmpty()
  weekday!: Weekday;
  @IsString()
  @IsNotEmpty()
  hour!: string;

  @IsEnum(FrequencyType)
  @IsNotEmpty()
  frequency!: FrequencyType;

  @IsNotEmpty()
  @IsNumber()
  valuePerUser!: number;
}
