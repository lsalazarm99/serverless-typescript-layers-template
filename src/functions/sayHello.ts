import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Chance, Response } from "general";
import { helloProducer } from "hello_world_producer";

// eslint-disable-next-line @typescript-eslint/require-await
export const handler: APIGatewayProxyHandlerV2 = async () => {
  return Response.ok({
    message: `${helloProducer()} ${new Chance().name()}!`,
  });
};
