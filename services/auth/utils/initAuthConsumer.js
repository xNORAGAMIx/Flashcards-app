import amqp from "amqplib";
import { userCreationErrors } from "../utils/userErrorCache.js";

export const initAuthConsumer = async () => {
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost:5672"
  );
  const channel = await conn.createChannel();
  await channel.assertQueue("user.created.failed", { durable: true });

  channel.consume("user.created.failed", (msg) => {
    const error = JSON.parse(msg.content.toString());
    console.log("Auth received failure:", error);

    // Store error temporarily
    userCreationErrors.set(error.userId, error.message);

    channel.ack(msg);
  });

  console.log("Auth service listening for user.created.failed");
};
