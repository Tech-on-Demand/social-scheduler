import { Module } from '@nestjs/common';
import { DatabaseModule } from '@turbotech/social-nestjs-libraries/database/prisma/database.module';
import { BootstrapService } from './bootstrap.service';

@Module({
  imports: [DatabaseModule],
  providers: [BootstrapService],
})
export class BootstrapModule {}
