import amqp from "amqplib";

let channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_URL || "amqp://localhost:5672");
  channel = await connection.createChannel();
  await channel.assertQueue("study.completed", { durable: true });
};

export const publishToQueue = async (queue, data) => {
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
    persistent: true,
  });
};

export const consumeQueue = async (queue, callback) => {
  await channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      await callback(content);
      channel.ack(msg);
    }
  });
};

