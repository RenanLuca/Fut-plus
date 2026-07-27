import { IsBoolean, IsNotEmpty } from "class-validator";

export class UpdateMatchPresenceDto {
  @IsNotEmpty()
  @IsBoolean()
  isPresent!: boolean;
}
