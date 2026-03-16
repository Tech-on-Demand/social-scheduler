import { Global, Module } from '@nestjs/common';
import { LoadToolsService } from '@turbotech/social-nestjs-libraries/chat/load.tools.service';
import { MastraService } from '@turbotech/social-nestjs-libraries/chat/mastra.service';
import { toolList } from '@turbotech/social-nestjs-libraries/chat/tools/tool.list';

@Global()
@Module({
  providers: [MastraService, LoadToolsService, ...toolList],
  get exports() {
    return this.providers;
  },
})
export class ChatModule {}
