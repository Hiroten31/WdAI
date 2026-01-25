import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672';
const QUEUE_NAME = 'note_notifications';

let channel = null;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.warn('RabbitMQ not available (optional feature):', error.message);
    return null;
  }
}

export async function publishNoteEvent(eventType, noteData) {
  if (!channel) return; // Gracefully skip if RabbitMQ is not available

  const message = JSON.stringify({
    type: eventType, // 'note_created', 'note_updated', 'note_deleted'
    timestamp: new Date().toISOString(),
    data: noteData,
  });

  try {
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
    console.log(`[${eventType}] Published to queue:`, noteData.id);
  } catch (error) {
    console.error('Failed to publish message:', error.message);
  }
}

export async function consumeNoteEvents(callback) {
  if (!channel) return;

  try {
    await channel.consume(QUEUE_NAME, async (msg) => {
      if (msg) {
        const event = JSON.parse(msg.content.toString());
        console.log(`[Consumed] ${event.type}:`, event.data.id);
        await callback(event);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Failed to consume messages:', error.message);
  }
}
