import { Module } from '@nestjs/common';
import { KafkaConsumerService, KafkaProducerService } from 'src/services';

@Module({
  providers: [KafkaConsumerService, KafkaProducerService],
  exports: [KafkaConsumerService, KafkaProducerService],
  imports: [],
})
export class KafkaModule {}
