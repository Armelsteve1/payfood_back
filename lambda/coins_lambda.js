import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "coins";

export const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /coins/{id}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id}`;
        break;
      case "GET /coins/{id}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id: event.pathParameters.id,
            },
          })
        );
        body = body.Item;
        break;
      case "GET /coins":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "GET /coins/{customer}":
        body = await dynamo.send(
          new ScanCommand({
            TableName: tableName,
            FilterExpression: "customer = :customer",
            ExpressionAttributeValues: {
              ":customer": event.pathParameters.customer,
            },
          })
        );
        body = body.Items;
        break;
      case "POST /coins":
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: requestJSON.id,
              amount: requestJSON.amount,
              updatedAt: requestJSON.updatedAt,
              customer: requestJSON.customer,
            },
          })
        );
        body = `Put coins ${requestJSON.id}`;
        break;
      case "PUT /coins/{id}":
        let putRequestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id: event.pathParameters.id,
              amount: putRequestJSON.amount,
              updatedAt: putRequestJSON.updatedAt,
              customer: putRequestJSON.customer,
            },
          })
        );
        body = `Updated coins ${event.pathParameters.id}`;
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  return {
    statusCode,
    body,
    headers,
  };
};
