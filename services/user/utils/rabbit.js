import amqp from 'amqplib';
import UserProfile from '../models/UserProfile.js';


export const connectRabbit = async () => {
  const connection = await amqp.connect("amqp://localhost:5672");
  const channel = await connection.createChannel();
  await channel.assertQueue("user.created", { durable: true });

  channel.consume("user.created", async (msg) => {
    const data = JSON.parse(msg.content.toString());
    console.log("Received user.created:", data);

    const exists = await UserProfile.findOne({ userId: data.userId });
    if (!exists) {
      await UserProfile.create({ userId: data.userId });
      console.log("User profile created for", data.username);
    }

    channel.ack(msg);
  });
}