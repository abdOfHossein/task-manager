import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, IsString } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
export class UpdateBackendDto {
    @ApiProperty()
    @Allow()
    @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
    @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
    slug_name: string;

    @ApiProperty()
    @Allow()
    @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
    @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
    route: string;

    @ApiProperty()
    @Allow()
    @IsNotEmpty({ message: i18nValidationMessage('i18n.public.FIELD_MUST_FILL') })
    @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
    method: string;

    @ApiProperty()
    @Allow()
    @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
    body: string;

    @ApiProperty()
    @Allow()
    @IsString({ message: i18nValidationMessage('i18n.public.INPUT_TYPE_MUST_BE_STRING') })
    query: string;
}