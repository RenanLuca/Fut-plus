import { GroupMemberType } from "@src/shared/enum/groupMemberType";
import { PositionEnum } from "@src/shared/enum/positionEnum";
import { UserRank } from "@src/shared/enum/userRank";
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateGroupMemberDto {
  @IsNotEmpty()
  @IsIn(
    Object.values(GroupMemberType).filter(
      (t) => t !== GroupMemberType.OWNER,
    ),
  )
  type!: Exclude<GroupMemberType, GroupMemberType.OWNER>;
  @IsNotEmpty()
  @IsEnum(UserRank)
  rank!: UserRank;
  @IsString()
  @IsOptional()
  name!: string;
  @IsEnum(PositionEnum)
  @IsOptional()
  position!: PositionEnum;
}
