const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();
const client = new DynamoDBClient({ region: "eu-north-1" });

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.MENU_TABLE_NAME;


const handler = async (event, context) => {
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case "DELETE /items/{id_rest}/{id_menu}":
        await dynamo.send(
          new DeleteCommand({
            TableName: tableName,
            Key: {
              id_rest: event.pathParameters.id_rest,
              id_menu: event.pathParameters.id_menu,
            },
          })
        );
        body = `Deleted item ${event.pathParameters.id_rest}/${event.pathParameters.id_menu}`;
        break;
      case "GET /items/{id_rest}/{id_menu}":
        body = await dynamo.send(
          new GetCommand({
            TableName: tableName,
            Key: {
              id_rest: event.pathParameters.id_rest,
              id_menu: event.pathParameters.id_menu,
            },
          })
        );
        body = body.Item;
        break;
      case "GET /items":
        body = await dynamo.send(
          new ScanCommand({ TableName: tableName })
        );
        body = body.Items;
        break;
      case "PUT /items":
        let requestJSON = JSON.parse(event.body);
        await dynamo.send(
          new PutCommand({
            TableName: tableName,
            Item: {
              id_rest: requestJSON.id_rest,
              id_menu: requestJSON.id_menu,
              price: requestJSON.price,
              name: requestJSON.name,
            },
          })
        );
        body = `Put item ${requestJSON.id_rest}/${requestJSON.id_menu}`;
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
module.exports = { handler };
