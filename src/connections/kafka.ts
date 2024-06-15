import dotenv from "dotenv"
import { Kafka } from "kafkajs"

// DOTENV CONFIGURATION
dotenv.config();

const kafkaServer = new Kafka({
     clientId: process.env.CLIENT_ID,
     brokers: [process.env.BROKER!],
})

export const kafkaProducer = kafkaServer.producer();
export const kafkaConsumer = kafkaServer.consumer({ groupId: process.env.GROUP_ID! });