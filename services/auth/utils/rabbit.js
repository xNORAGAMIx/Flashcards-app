import amqp from "amqplib";

let channel;

export const connectRabbit = async () => {
  const connection = await amqp.connect("amqp://localhost:5672"); // 'rabbitmq' = container name in Docker
  channel = await connection.createChannel();
  await channel.assertQueue("user.created", { durable: true });
};

export const publishUserCreated = (user) => {
  const payload = Buffer.from(
    JSON.stringify({
      userId: user._id,
      email: user.email,
      username: user.username,
    })
  );
  channel.sendToQueue("user.created", payload);
};
