import { Injectable, OnModuleInit } from '@nestjs/common';
import { GroupeIds, ProducerTopics } from 'src/enums';
import { KafkaConsumerService } from 'src/services';

@Injectable()
export class ShipmentUpdateConsumer implements OnModuleInit {
  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  async onModuleInit() {
    this.kafkaConsumer.consume(
      GroupeIds.SHIPMENT_UPDATE,
      { topic: ProducerTopics.SHIPMENT_TRANSIT },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: GroupeIds.SHIPMENT_UPDATE,
            message: message.value.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}
