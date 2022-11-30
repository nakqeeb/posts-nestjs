import { IsEnum } from "class-validator";
import { RoleEnum } from "../role.enum";

export class UpdateRoleDto {
    @IsEnum(RoleEnum)
    roles: RoleEnum;
}