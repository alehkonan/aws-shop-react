import { APIGatewayProxyEvent } from "aws-lambda";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "https://d2rcjsjs5l9fv3.cloudfront.net",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Credentials": true,
};

export function logRequestArguments(event: APIGatewayProxyEvent) {
  const timestamp = new Date().toISOString();

  console.log(
    `${timestamp} ${event.httpMethod} ${event.resource} ${event.path}`
  );
}
