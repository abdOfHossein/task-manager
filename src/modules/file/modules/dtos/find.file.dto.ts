import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, IsUUID } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";


export class FindFileDto {
    @ApiProperty()
    @Allow()
    @IsUUID("all", { message: i18nValidationMessage('i18n.public.UUID_NOT_MATCH') })
    @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
    id_file: string
}