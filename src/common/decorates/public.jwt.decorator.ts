import { SetMetadata } from '@nestjs/common';
export const PublicJwt = () => SetMetadata('isPublic', true);