import { Kafka } from "kafkajs";

const kafkaServer = new Kafka({
     clientId: "fleet-app",
     brokers: ["localhost:9092"],
})

export const kafkaProducer = kafkaServer.producer();
export const kafkaConsumer = kafkaServer.consumer({ groupId: "test-group" });