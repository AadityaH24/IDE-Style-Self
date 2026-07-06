import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const sqs = new SQSClient({});
const eventBridge = new EventBridgeClient({});

// Publish domain event
async function publishEvent(event: { type: string; payload: unknown }) {
  await eventBridge.send(new PutEventsCommand({
    Entries: [{
      Source: "cache.platform",
      DetailType: event.type,
      Detail: JSON.stringify(event.payload),
    }],
  }));
}

// Enqueue work item
async function enqueue<T>(queueUrl: string, message: T) {
  await sqs.send(new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  }));
}
