import { Module } from '@nestjs/common';
import { MailService } from 'src/services';

@Module({
  providers: [MailService],
  imports: [],
})
export class MailModule {}
