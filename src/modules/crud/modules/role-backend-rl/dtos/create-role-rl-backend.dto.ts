import { ApiHideProperty, ApiProperty } from "@nestjs/swagger"
import { Allow, IsNotEmpty, IsUUID } from "class-validator"
import { i18nValidationMessage } from "nestjs-i18n"
import { RoleEnt } from "src/modules/role/modules/entities/role.entity"
import { BackendEnt } from "../../backend/entities/backend.entity"

export class CreateRoleRlBackendDto {
    @ApiHideProperty()
    role: RoleEnt

    @ApiHideProperty()
    backend: BackendEnt

    @ApiProperty()
    @Allow()
    @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
    @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
    id_role: string

    @ApiProperty()
    @Allow()
    @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
    @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
    id_backend: string
}