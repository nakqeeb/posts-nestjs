import { IsBoolean } from "class-validator";

export class ActivateUserDto {
    @IsBoolean()
    activated: boolean;
}
