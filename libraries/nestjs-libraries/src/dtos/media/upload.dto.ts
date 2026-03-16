import { IsDefined, IsString, Validate } from 'class-validator';
import { ValidUrlExtension } from '@turbotech/social-helpers/utils/valid.url.path';

export class UploadDto {
  @IsString()
  @IsDefined()
  @Validate(ValidUrlExtension)
  url: string;
}
