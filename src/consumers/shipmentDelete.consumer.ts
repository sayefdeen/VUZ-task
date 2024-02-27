import { Injectable, OnModuleInit } from '@nestjs/common';
import { GroupeIds, ProducerTopics } from 'src/enums';
import { KafkaConsumerService } from 'src/services';

@Injectable()
export class ShipmentDeleteConsumer implements OnModuleInit {
  constructor(private readonly kafkaConsumer: KafkaConsumerService) {}

  async onModuleInit() {
    this.kafkaConsumer.consume(
      GroupeIds.SHIPMENT_DELETE,
      { topic: ProducerTopics.SHIPMENT_DELETED },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            source: GroupeIds.SHIPMENT_DELETE,
            message: message.value.toString(),
            partition: partition.toString(),
            topic: topic.toString(),
          });
        },
      },
    );
  }
}
